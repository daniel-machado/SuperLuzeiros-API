import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository"; 
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const createSpecialtyUseCase = async (
  data: ISpecialty,
  specialtyRepository: ISpecialtyRepository, 
) => {

  const newSpecialty = await specialtyRepository.create(data);

  return {
    newSpecialty
  };
}
