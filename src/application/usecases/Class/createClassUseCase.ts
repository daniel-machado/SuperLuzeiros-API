import { IClass } from "../../../infrastructure/database/models/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const createClassUseCase = async (
  data: IClass,
  classRepository: IClassRepository, 
) => {

  const newClass = await classRepository.create(data);

  return {
    newClass
  };
}
