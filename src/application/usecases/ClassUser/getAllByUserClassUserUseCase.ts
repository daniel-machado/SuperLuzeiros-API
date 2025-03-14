import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const getAllByUserClassUserUseCase = async (
  userId: string,
  userClassRepository: IUserClassRepository, 
) => {

  const classUser = await userClassRepository.findAllByUser(userId);

  return {
    classUser
  };
}
