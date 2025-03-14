import { IUserSpecialty } from "../../../infrastructure/database/models/UserSpecialty";
import { IUserSpecialtyRepository } from "../../../infrastructure/database/repositories/UserSpecialtyRepository";

export const updateSpecialtyUserUseCase = async (
  id: string,
  data: IUserSpecialty,
  userSpecialtyRepository: IUserSpecialtyRepository, 
) => {

  if (!id) throw new Error('id this associate specialty is required');

  const existingUserSpecialty = await userSpecialtyRepository.findById(id)
  if (!existingUserSpecialty) throw new Error("Not existing user specialty!");

  const associateSpecialty = await userSpecialtyRepository.update(id, data);
  if (!associateSpecialty) throw new Error("Not existing user specialty!");

  return {
    associateSpecialty
  };

}


