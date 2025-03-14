import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const getAllByClassUserUseCase = async (
  classId: string,
  userClassRepository: IUserClassRepository, 
) => {

  const classAll = await userClassRepository.findAllByClass(classId);

  return {
    classAll
  };
}
