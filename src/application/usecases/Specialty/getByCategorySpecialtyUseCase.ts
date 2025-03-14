import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository"; 
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const getByCategorySpecialtyUseCase = async (
  category: string,
  specialtyRepository: ISpecialtyRepository, 
) => {
  const specialty = await specialtyRepository.findByCategory(category);
  if (!specialty) throw new Error("Not existing specialty!");
  
  return {
    specialty
  };
}
