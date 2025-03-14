import { IClass } from "../../../infrastructure/database/models/Class";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const updateClassUseCase = async (
  id: string,
  data: IClass,
  classRepository: IClassRepository, 
) => {
  
  if (!id) throw new Error('id is required.');

  const classExisting = await classRepository.findById(id)
  if (!classExisting) throw new Error("Not existing Class!");

  const classUpdate = await classRepository.update(id, data)

  return {
    classUpdate
  };

}
