import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository";
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const updateSpecialtyUseCase = async (
  id: string,
  data: ISpecialty,
  specialtyRepository: ISpecialtyRepository, 
) => {
  
  if (!id) throw new Error('id is required.');

  const existingSpecialty = await specialtyRepository.findById(id)
  if (!existingSpecialty) throw new Error("Not existing specialty!");

  const SpecialtyUpdate = await specialtyRepository.update(id, data)

  return {
    SpecialtyUpdate
  };

}
