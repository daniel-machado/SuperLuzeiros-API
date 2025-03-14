import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository";
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const getByLevelSpecialtyUseCase = async (
  level: number,
  specialtyRepository: ISpecialtyRepository, 
) => {
  const specialty = await specialtyRepository.findByLevel(level);
  if (!specialty) throw new Error("Not existing specialty!");
  
  return {
    specialty
  };
}
