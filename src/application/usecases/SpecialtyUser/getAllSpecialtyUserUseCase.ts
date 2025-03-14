import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const getAllSpecialtyUserUseCase = async (
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const specialty = await userSpecialtyRepository.findAll();

  return {
    specialty
  };
}
