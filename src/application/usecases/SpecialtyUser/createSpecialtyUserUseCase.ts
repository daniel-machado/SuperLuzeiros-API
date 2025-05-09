import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const createSpecialtyUserUseCase = async (
  data: IUserSpecialty,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {
  const {userId, specialtyId} = data;
  const existingSpecialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);
  if (existingSpecialty) {
    throw new Error("Esse usuário já tem essa Especialidade");
  }

  const newSpecialty = await userSpecialtyRepository.create(data);
  return {
    newSpecialty
  };
}
