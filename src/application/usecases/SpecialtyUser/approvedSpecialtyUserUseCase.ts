import { StatusSpecialty } from "../../../infrastructure/ENUMS/StatusSpecialty";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const approvedSpecialtyUserUseCase = async (
  userId: string, 
  specialtyId: string,
  userIdApproved: string,
  comment: string, 
  userSpecialtyRepository: IUserSpecialtyRepository, 
  userRepository: IUserRepository
) => {

  const userSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
  if (!userSpecialty) {
    throw new Error("Especialidade não encontrada.");
  }

  const user = await userRepository.findUserById(userIdApproved);
  const approverRole = user?.role as string;
  if (approverRole !== "director" && approverRole !== "lead" && approverRole !== "counselor") {
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
  else if (approverRole === "director") {
    if (!userSpecialty.leadApproval) {
      throw new Error("O Líder precisa aprovar primeiro.");
    }
    if (userSpecialty.directorApproval) {
      throw new Error("Diretor já aprovou esse relatório.");
    }
    userSpecialty.directorApproval = true;
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
