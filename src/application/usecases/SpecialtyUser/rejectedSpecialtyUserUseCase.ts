import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const rejectedSpecialtyUserUseCase = async (
  userId: string, 
  specialtyId: string,
  userIdRejected: string,
  comment: string, 
  userSpecialtyRepository: IUserSpecialtyRepository, 
  userRepository: IUserRepository
) => {

  const userSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
  if (!userSpecialty) {
    throw new Error("Especialidade não encontrada.");
  }

  if (!userSpecialty.approvalStatus?.startsWith('waiting_by_')) {
    throw new Error('Este relatório não está aguardando rejeição.');
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

  const user = await userRepository.findUserById(userIdRejected);
  const approverRole = user?.role as string;
  if (approverRole !== "director" && approverRole !== "lead" && approverRole !== "counselor" && approverRole !== "admin") {
    throw new Error("Usuário não autorizado para Reprovar");
  }
  
  if (approverRole === "counselor") {
    if (userSpecialty.counselorApproval) {
      throw new Error("Conselheiro já aprovou esse relatório. Não pode rejeitar.");
    }
  } 
  else if (approverRole === "lead") {
    if (!userSpecialty.counselorApproval) {
      throw new Error("Ainda está no nível do conselheiro");
    }
    if (userSpecialty.leadApproval) {
      throw new Error("Líder já aprovou esse relatório. Não pode rejeitar.");
    }
  } 
  else if (approverRole === "director") {
    if (!userSpecialty.leadApproval) {
      throw new Error("Ainda está no nível do Líder");
    }
    if (userSpecialty.directorApproval) {
      throw new Error("Diretor já aprovou esse relatório. Não pode rejeitar.");
    }
  }

  const rejected = await userSpecialtyRepository.rejectReport(
    userId, 
    specialtyId, 
    approverRole, 
    comment
  );

  return {
    rejected
  };
}
