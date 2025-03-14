import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const getAllBySpecialtyUserUseCase = async (
  specialtyId: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const specialty = await userSpecialtyRepository.findAllBySpecialty(specialtyId);

  return {
    specialty
  };
}
