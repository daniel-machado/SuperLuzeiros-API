import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const getByUserAndClassUserUseCase = async (
  userId: string,
  classId: string,
  userClassRepository: IUserClassRepository, 
) => {

  const classes = await userClassRepository.findByUserAndClass(userId, classId);

  return {
    classes
  };
}
