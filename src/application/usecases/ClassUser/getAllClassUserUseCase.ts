import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const getAllClassUserUseCase = async (
  userClassRepository: IUserClassRepository, 
) => {

  const classes = await userClassRepository.findAll();

  return {
    classes
  };
}
