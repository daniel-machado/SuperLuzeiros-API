import { IClass } from "../../../infrastructure/database/models/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const getAllClassUseCase = async (
  classRepository: IClassRepository, 
) => {
  const classAll = await classRepository.findAll();
  return {
    classAll
  };
}
