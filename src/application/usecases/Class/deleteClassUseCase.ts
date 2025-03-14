
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";

export const deleteClassUseCase = async (
  classId: string,
  classRepository: IClassRepository, 
) => {

  if (!classId) throw new Error('id is required.');

  const existingClass = await classRepository.findById(classId)
  if (!existingClass) throw new Error("Not existing Class!!");

  await classRepository.delete(classId);
}
