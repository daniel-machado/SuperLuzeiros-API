import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const sendReportUserSpecialtyUseCase = async (
  id: string,
  userId: string, 
  specialtyId: string,
  report: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  if (!id) throw new Error('id this associate specialty is required');

  const existingUserSpecialty = await userSpecialtyRepository.findById(id)
  if (!existingUserSpecialty) throw new Error("Not existing user specialty!");

  if (!existingUserSpecialty.isQuizApproved) {
    throw new Error("Quiz não aprovado");
  }

  if (existingUserSpecialty.report && existingUserSpecialty.approvalStatus !== 'pending'){ 
    throw new Error("Relatorio já foi enviado.");
  }  
  
  const associateSpecialty = await userSpecialtyRepository.sendReportUser(userId, specialtyId, report);
  if (!associateSpecialty) throw new Error("Not existing user specialty!");



  return {
    associateSpecialty
  };

}

