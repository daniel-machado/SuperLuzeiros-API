import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const deleteSpecialtyUserUseCase = async (
  id: string,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  const deleteSpecialty = await userSpecialtyRepository.delete(id);

  return {
    deleteSpecialty
  };
}
