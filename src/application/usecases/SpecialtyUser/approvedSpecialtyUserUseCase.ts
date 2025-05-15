import { IIndividualEvaluation } from "../../../infrastructure/database/models/IndividualEvaluation";
import { StatusSpecialty } from "../../../infrastructure/ENUMS/StatusSpecialty";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const approvedSpecialtyUserUseCase = async (
  userId: string, 
  specialtyId: string,
  userIdApproved: string,
  comment: string, 
  userSpecialtyRepository: IUserSpecialtyRepository, 
  userRepository: IUserRepository,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,

  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository,

  unitRepository: IUnitRepository
) => {

  const userSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
  if (!userSpecialty) {
    throw new Error("Especialidade não encontrada.");
  }

  const user = await userRepository.findUserById(userIdApproved);
  const approverRole = user?.role as string;
  if (approverRole !== "director" && approverRole !== "admin" && approverRole !== "lead" && approverRole !== "counselor") {
    throw new Error("Usuário não autorizado para aprovação");
  }

  if (!userSpecialty.approvalStatus?.startsWith('waiting_by_')) {
    throw new Error('Este relatório não está aguardando aprovação.');
  }

  if (!userSpecialty.isQuizApproved) {
    throw new Error("Quiz não aprovado");
  }

  if (userSpecialty.approvalStatus === "pending") {
    throw new Error("PENDING - falta o envio do relatório");
  }

  if(userSpecialty.approvalStatus === 'approved'){
    throw new Error("Especialidade já aprovada.");
  }

  // 🔹 Lógica de aprovação por ordem correta
  if (userId !== "dbv") {
    if (approverRole === "lead") {
      if (userSpecialty.leadApproval) {
        throw new Error("Líder já aprovou esse relatório.");
      }
      userSpecialty.leadApproval = true;
    } 
    else if (approverRole === "director" || approverRole === "admin") {
      if (!userSpecialty.leadApproval) {
        throw new Error("O Líder precisa aprovar primeiro.");
      }
      if (userSpecialty.directorApproval) {
        throw new Error("Diretor já aprovou esse relatório.");
      }
      userSpecialty.directorApproval = true;
    }
  } else {
    if (approverRole === "counselor") {
      if (userSpecialty.counselorApproval) {
        throw new Error("Conselheiro já aprovou esse relatório.");
      }
      userSpecialty.counselorApproval = true;
    } 
    else if (approverRole === "lead") {
      if (!userSpecialty.counselorApproval) {
        throw new Error("O Conselheiro precisa aprovar primeiro.");
      }
      if (userSpecialty.leadApproval) {
        throw new Error("Líder já aprovou esse relatório.");
      }
      userSpecialty.leadApproval = true;
    } 
    else if (approverRole === "director" || approverRole === "admin") {
      if (!userSpecialty.leadApproval) {
        throw new Error("O Líder precisa aprovar primeiro.");
      }
      if (userSpecialty.directorApproval) {
        throw new Error("Diretor já aprovou esse relatório.");
      }
      userSpecialty.directorApproval = true;
    }

    if(approverRole === "admin" || approverRole === "director"){
      const pointsSpecialtyUser = 20 // Pontos por especialidade aprovada pelo Diretor
      const pointsSpecialtyUnit = 5 // Pontos por especialidade aprovada pelo diretor para a unidade
      
      const evaluationActive = await individualEvaluationRepository.findActiveEvaluationByUser(userId)
      if(!evaluationActive){
        throw new Error('Não existe avaliação ativa')
      }
      const userExistingInUnit = await unitRepository.existeDBVOtherUnit(userId);
      if(!userExistingInUnit){
        throw new Error('Usuário não Existe nessa unidade')
      }
      const evaluationActiveUnit = await unitEvaluationRepository.findActiveEvaluationByUnitId(userExistingInUnit.unitId)
      if(!evaluationActiveUnit){
        throw new Error('Não existe avaliação ativa para essa unidade.')
      }

      const total = Number(evaluationActive.totalScore) + pointsSpecialtyUser;

      // Atualizar a pontuação final somando `examScore` + respostas adicionais
      await individualEvaluationRepository.updateEvaluation(evaluationActive.id as string, {
        totalScore: total
      });

      const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, evaluationActive.week);
    
      if (existingRanking) {
        existingRanking.totalScore = total
        await individualRankingRepository.updateRanking(existingRanking);
      }


      // PONTOS PARA A UNIDADE
      const totalUnit = Number(evaluationActiveUnit.totalScore) + pointsSpecialtyUnit;

      // Atualizar a pontuação final somando `examScore` + respostas adicionais
      await unitEvaluationRepository.updateUnitEvaluation(evaluationActiveUnit.id as string, {
        totalScore: totalUnit
      });

      
      const existingRankingUnit = await unitRankingRepository.findByUnitAndWeek(userExistingInUnit.unitId as string, evaluationActiveUnit.week);
    
      if (existingRankingUnit) {
        existingRankingUnit.totalScore = totalUnit
        await unitRankingRepository.updateRanking(existingRankingUnit);
      }else{
        throw new Error('Ranking nao encontrado')
      }
    }
  }

  // Se todos aprovaram, a especialidade é oficialmente aprovada
  // if (userSpecialty.counselorApproval && userSpecialty.leadApproval && userSpecialty.directorApproval) {
  //   userSpecialty.approvalStatus = 'approved' as StatusSpecialty;
  // }

  if(userSpecialty.approvalStatus === 'approved' as StatusSpecialty){
    throw new Error("Especialidade já aprovada.");
  }

  const approved = await userSpecialtyRepository.approveReport(
    userId, 
    specialtyId, 
    approverRole, 
    comment
  );

  return {
    approved
  };
}
