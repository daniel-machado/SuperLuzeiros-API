import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository"; 
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const getAllSpecialtyUseCase = async (
  specialtyRepository: ISpecialtyRepository, 
) => {
  const specialty = await specialtyRepository.findAll();
  return {
    specialty
  };
}
