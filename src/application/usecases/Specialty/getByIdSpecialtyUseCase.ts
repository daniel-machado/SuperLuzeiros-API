import { ISpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository";
import { ISpecialty } from "../../../infrastructure/database/models/Specialty"; 

export const getByIdSpecialtyUseCase = async (
  idSpecialty: string,
  specialtyRepository: ISpecialtyRepository, 
) => {

  const specialty = await specialtyRepository.findById(idSpecialty);
  if (!specialty) throw new Error("Not existing specialty!");
  return {
    specialty
  };
}
