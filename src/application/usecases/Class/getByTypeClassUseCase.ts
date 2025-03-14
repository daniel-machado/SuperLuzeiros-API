import { IClass } from "../../../infrastructure/database/models/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const getByTypeClassUseCase = async (
  typeClass: string,
  classRepository: IClassRepository, 
) => {
  const classExisting = await classRepository.findByType(typeClass);
  if (!classExisting) throw new Error("Not existing Class!");
  
  return {
    classExisting
  };
}
