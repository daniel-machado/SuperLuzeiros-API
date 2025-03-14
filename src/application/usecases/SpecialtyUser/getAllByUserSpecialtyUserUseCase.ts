import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const getAllByUserSpecialtyUserUseCase = async (
  userId: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const specialty = await userSpecialtyRepository.findAllByUser(userId);

  return {
    specialty
  };
}
