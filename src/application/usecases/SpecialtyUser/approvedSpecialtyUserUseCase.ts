import { IIndividualEvaluation } from "../../../infrastructure/database/models/IndividualEvaluation";
import { StatusSpecialty } from "../../../infrastructure/ENUMS/StatusSpecialty";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const approvedSpecialtyUserUseCase = async (
  userId: string, 
  specialtyId: string,
  userIdApproved: string,
  comment: string, 
  userSpecialtyRepository: IUserSpecialtyRepository, 
  userRepository: IUserRepository,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,

  unitEvaluationRepository: IUnitEvaluationRepository
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

    const pointsSpecialty = 20 // Pontos por especialidade aprovada pelo Diretor
    
    const evaluationActive = await individualEvaluationRepository.findActiveEvaluationByUser(userId)
    if(!evaluationActive){
      throw new Error('Não existe avaliação ativa')
    }
    const total = Number(evaluationActive.totalScore) + pointsSpecialty;

    // Atualizar a pontuação final somando `examScore` + respostas adicionais
    await individualEvaluationRepository.updateEvaluation(evaluationActive.id as string, {
      totalScore: total
    });

    const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, evaluationActive.week);
  
    if (existingRanking) {
      existingRanking.totalScore = total
      await individualRankingRepository.updateRanking(existingRanking);
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
