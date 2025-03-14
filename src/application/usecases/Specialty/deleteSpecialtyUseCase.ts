import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository"; 
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const deleteSpecialtyUseCase = async (
  idSpecialty: string,
  specialtyRepository: ISpecialtyRepository, 
) => {

  if (!idSpecialty) throw new Error('id is required.');

  const existingSpecialty = await specialtyRepository.findById(idSpecialty)
  if (!existingSpecialty) throw new Error("Not existing specialty!");

  await specialtyRepository.delete(idSpecialty);
}
