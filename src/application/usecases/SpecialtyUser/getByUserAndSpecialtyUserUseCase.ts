import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const getByUserAndSpecialtyUserUseCase = async (
  userId: string,
  specialtyId: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const specialty = await userSpecialtyRepository.findByUserAndSpecialty(userId, specialtyId);

  return {
    specialty
  };
}
