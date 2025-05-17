import { IIndividualEvaluation } from "../../../infrastructure/database/models/IndividualEvaluation";
import { StatusSpecialty } from "../../../infrastructure/ENUMS/StatusSpecialty";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";
import Decimal from "decimal.js";

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
  
  // 🔹 Busca a especialidade do usuário
  const userSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
  if (!userSpecialty) throw new Error("Especialidade não encontrada.");

  // 🔹 Verifica se o usuário existe
  const userRoleData = await userRepository.findUserById(userId);
  if (!userRoleData) throw new Error("Usuário não encontrado");

  // 🔹 Verifica se o aprovador tem permissão
  const approver = await userRepository.findUserById(userIdApproved);
  const approverRole = approver?.role as string;
  const allowedRoles = ["director", "admin", "lead", "counselor"];
  if (!allowedRoles.includes(approverRole)) throw new Error("Usuário não autorizado para aprovação");

  // 🔹 Validações de status da especialidade
  if (!userSpecialty.approvalStatus?.startsWith("waiting_by_")) {
    throw new Error("Este relatório não está aguardando aprovação.");
  }
  if (!userSpecialty.isQuizApproved) throw new Error("Quiz não aprovado");
  if (userSpecialty.approvalStatus === "pending") throw new Error("PENDING - falta o envio do relatório");
  if (userSpecialty.approvalStatus === "approved") throw new Error("Especialidade já aprovada.");

  // 🔹 Aprovação por ordem (para dbv e não-dbv)
  const isDbv = userRoleData.role === "dbv";
  if (!isDbv) {
    if (approverRole === "lead") {
      if (userSpecialty.leadApproval) throw new Error("Líder já aprovou esse relatório.");
      userSpecialty.leadApproval = true;
    } else if (["director", "admin"].includes(approverRole)) {
      if (!userSpecialty.leadApproval) throw new Error("O Líder precisa aprovar primeiro.");
      if (userSpecialty.directorApproval) throw new Error("Diretor já aprovou esse relatório.");
      userSpecialty.directorApproval = true;
    }
  } else {
    if (approverRole === "counselor") {
      if (userSpecialty.counselorApproval) throw new Error("Conselheiro já aprovou esse relatório.");
      userSpecialty.counselorApproval = true;
    } else if (approverRole === "lead") {
      if (!userSpecialty.counselorApproval) throw new Error("O Conselheiro precisa aprovar primeiro.");
      if (userSpecialty.leadApproval) throw new Error("Líder já aprovou esse relatório.");
      userSpecialty.leadApproval = true;
    } else if (["director", "admin"].includes(approverRole)) {
      if (!userSpecialty.leadApproval) throw new Error("O Líder precisa aprovar primeiro.");
      if (userSpecialty.directorApproval) throw new Error("Diretor já aprovou esse relatório.");
      userSpecialty.directorApproval = true;
    }
  }

  // 🔹 Lógica de pontuação para DBV ou Conselheiro (executada fora do bloco de aprovação)
  if (["admin", "director"].includes(approverRole)) {
    const userRole = userRoleData.role;
    console.log("userRole dentro da lógica de pontuação", userRole);

    if (userRole === "dbv") {
      const userInUnit = await unitRepository.existeDBVOtherUnit(userId);
      if (!userInUnit) throw new Error("DBV não está alocado em nenhuma unidade");

      const pointsSpecialtyUser = 30;
      const pointsSpecialtyUnit = 5;

      const evaluation = await individualEvaluationRepository.findActiveEvaluationByUser(userId);
      if (!evaluation) throw new Error("Não existe avaliação ativa");

      const total = new Decimal(evaluation.totalScore || 0).plus(pointsSpecialtyUser);
      await individualEvaluationRepository.updateEvaluation(evaluation.id as string, {
        totalScore: total.toNumber(),
      });

      const ranking = await individualRankingRepository.findByUserAndWeek(userId, evaluation.week);
      if (ranking) {
        ranking.totalScore = total.toNumber();
        await individualRankingRepository.updateRanking(ranking);
      }

      const unitEvaluation = await unitEvaluationRepository.findActiveEvaluationByUnitId(userInUnit.unitId);
      if (!unitEvaluation) throw new Error("Não existe avaliação ativa para essa unidade.");

      const totalUnit = new Decimal(unitEvaluation.totalScore || 0).plus(pointsSpecialtyUnit);
      await unitEvaluationRepository.updateUnitEvaluation(unitEvaluation.id as string, {
        totalScore: totalUnit.toNumber(),
      });

      const unitRanking = await unitRankingRepository.findByUnitAndWeek(userInUnit.unitId, unitEvaluation.week);
      if (unitRanking) {
        unitRanking.totalScore = totalUnit.toNumber();
        await unitRankingRepository.updateRanking(unitRanking);
      } else {
        throw new Error("Ranking da unidade não encontrado");
      }

    } else if (userRole === "counselor") {
      const userInUnit = await unitRepository.existeOtherUnit(userId);
      if (!userInUnit) throw new Error("Counselor não está alocado em nenhuma unidade");

      const pointsSpecialtyUnit = 5;

      const unitEvaluation = await unitEvaluationRepository.findActiveEvaluationByUnitId(userInUnit.unitId);
      if (!unitEvaluation) throw new Error("Não existe avaliação ativa para essa unidade.");

      const totalUnit = new Decimal(unitEvaluation.totalScore || 0).plus(pointsSpecialtyUnit);
      await unitEvaluationRepository.updateUnitEvaluation(unitEvaluation.id as string, {
        totalScore: totalUnit.toNumber(),
      });

      const unitRanking = await unitRankingRepository.findByUnitAndWeek(userInUnit.unitId, unitEvaluation.week);
      if (unitRanking) {
        unitRanking.totalScore = totalUnit.toNumber();
        await unitRankingRepository.updateRanking(unitRanking);
      } else {
        throw new Error("Ranking da unidade não encontrado");
      }
    }
  }

  // 🔹 Verifica se o usuário tem papel definido
  if (!userRoleData.role) throw new Error("Usuário não possui um papel definido.");

  // 🔹 Aprova o relatório
  const approved = await userSpecialtyRepository.approveReport(
    userId,
    specialtyId,
    approverRole,
    comment,
    userRoleData.role
  );

  return approved;
};


// export const approvedSpecialtyUserUseCase = async (
//   userId: string, 
//   specialtyId: string,
//   userIdApproved: string,
//   comment: string, 
//   userSpecialtyRepository: IUserSpecialtyRepository, 
//   userRepository: IUserRepository,
//   individualEvaluationRepository: IIndividualEvaluationRepository,
//   individualRankingRepository: IInidividualRankingRepository,

//   unitEvaluationRepository: IUnitEvaluationRepository,
//   unitRankingRepository: IUnitRankingRepository,

//   unitRepository: IUnitRepository
// ) => {

//   const userSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
//   if (!userSpecialty) {
//     throw new Error("Especialidade não encontrada.");
//   }

//   const userRoleId = await userRepository.findUserById(userId);
//   if(!userRoleId){
//     throw new Error("Usuário não encontrado");
//   }

//   const user = await userRepository.findUserById(userIdApproved);
//   const approverRole = user?.role as string;
//   if (approverRole !== "director" && approverRole !== "admin" && approverRole !== "lead" && approverRole !== "counselor") {
//     throw new Error("Usuário não autorizado para aprovação");
//   }

//   if (!userSpecialty.approvalStatus?.startsWith('waiting_by_')) {
//     throw new Error('Este relatório não está aguardando aprovação.');
//   }

//   if (!userSpecialty.isQuizApproved) {
//     throw new Error("Quiz não aprovado");
//   }

//   if (userSpecialty.approvalStatus === "pending") {
//     throw new Error("PENDING - falta o envio do relatório");
//   }

//   if(userSpecialty.approvalStatus === 'approved'){
//     throw new Error("Especialidade já aprovada.");
//   }

//   // 🔹 Lógica de aprovação por ordem correta
//   if (userId !== "dbv") {
//     if (approverRole === "lead") {
//       if (userSpecialty.leadApproval) {
//         throw new Error("Líder já aprovou esse relatório.");
//       }
//       userSpecialty.leadApproval = true;
//     } 
//     else if (approverRole === "director" || approverRole === "admin") {
//       if (!userSpecialty.leadApproval) {
//         throw new Error("O Líder precisa aprovar primeiro.");
//       }
//       if (userSpecialty.directorApproval) {
//         throw new Error("Diretor já aprovou esse relatório.");
//       }
//       userSpecialty.directorApproval = true;
//     }
//   } else {
//     if (approverRole === "counselor") {
//       if (userSpecialty.counselorApproval) {
//         throw new Error("Conselheiro já aprovou esse relatório.");
//       }
//       userSpecialty.counselorApproval = true;
//     } 
//     else if (approverRole === "lead") {
//       if (!userSpecialty.counselorApproval) {
//         throw new Error("O Conselheiro precisa aprovar primeiro.");
//       }
//       if (userSpecialty.leadApproval) {
//         throw new Error("Líder já aprovou esse relatório.");
//       }
//       userSpecialty.leadApproval = true;
//     } 
//     else if (approverRole === "director" || approverRole === "admin") {
//       if (!userSpecialty.leadApproval) {
//         throw new Error("O Líder precisa aprovar primeiro.");
//       }
//       if (userSpecialty.directorApproval) {
//         throw new Error("Diretor já aprovou esse relatório.");
//       }
//       userSpecialty.directorApproval = true;
//     }

//     if(approverRole === "admin" || approverRole === "director"){
//       const pointsSpecialtyUser = 30 // Pontos por especialidade aprovada pelo Diretor
//       const pointsSpecialtyUnit = 5 // Pontos por especialidade aprovada pelo diretor para a unidade
      
//       const evaluationActive = await individualEvaluationRepository.findActiveEvaluationByUser(userId)
//       if(!evaluationActive){
//         throw new Error('Não existe avaliação ativa')
//       }
//       const userExistingInUnit = await unitRepository.existeDBVOtherUnit(userId);
//       if(!userExistingInUnit){
//         throw new Error('Usuário não Existe nessa unidade')
//       }
//       const evaluationActiveUnit = await unitEvaluationRepository.findActiveEvaluationByUnitId(userExistingInUnit.unitId)
//       if(!evaluationActiveUnit){
//         throw new Error('Não existe avaliação ativa para essa unidade.')
//       }

//       const total = new Decimal(evaluationActive.totalScore || 0).plus(pointsSpecialtyUser);

//       // Atualizar a pontuação final somando `examScore` + respostas adicionais
//       await individualEvaluationRepository.updateEvaluation(evaluationActive.id as string, {
//         totalScore: total.toNumber()
//       });

//       const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, evaluationActive.week);
    
//       if (existingRanking) {
//         existingRanking.totalScore = total.toNumber()
//         await individualRankingRepository.updateRanking(existingRanking);
//       }


//       // PONTOS PARA A UNIDADE
//       const totalUnit = new Decimal(evaluationActiveUnit.totalScore || 0).plus(pointsSpecialtyUnit);

//       // Atualizar a pontuação final somando `examScore` + respostas adicionais
//       await unitEvaluationRepository.updateUnitEvaluation(evaluationActiveUnit.id as string, {
//         totalScore: totalUnit.toNumber()
//       });

      
//       const existingRankingUnit = await unitRankingRepository.findByUnitAndWeek(userExistingInUnit.unitId as string, evaluationActiveUnit.week);
    
//       if (existingRankingUnit) {
//         existingRankingUnit.totalScore = totalUnit.toNumber()
//         await unitRankingRepository.updateRanking(existingRankingUnit);
//       }else{
//         throw new Error('Ranking nao encontrado')
//       }
//     }
//   }

//   // Se todos aprovaram, a especialidade é oficialmente aprovada
//   // if (userSpecialty.counselorApproval && userSpecialty.leadApproval && userSpecialty.directorApproval) {
//   //   userSpecialty.approvalStatus = 'approved' as StatusSpecialty;
//   // }

//   if(userSpecialty.approvalStatus === 'approved' as StatusSpecialty){
//     throw new Error("Especialidade já aprovada.");
//   }

//   if (!userRoleId.role) {
//     throw new Error("Usuário não possui um papel definido.");
//   }
  
//   const approved = await userSpecialtyRepository.approveReport(
//     userId, 
//     specialtyId, 
//     approverRole, 
//     comment,
//     userRoleId.role,
//   );

//   return {
//     approved
//   };
// }
