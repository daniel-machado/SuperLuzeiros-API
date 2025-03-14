import { IClass } from "../../../infrastructure/database/models/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const getByIdClassUseCase = async (
  classId: string,
  classRepository: IClassRepository, 
) => {

  const classExisting = await classRepository.findById(classId);
  if (!classExisting) throw new Error("Not existing Class!");
  return {
    classExisting
  };
}
