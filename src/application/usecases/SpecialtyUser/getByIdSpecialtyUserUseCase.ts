import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const getByIdSpecialtyUserUseCase = async (
  id: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const specialty = await userSpecialtyRepository.findById(id);

  return {
    specialty
  };
}
