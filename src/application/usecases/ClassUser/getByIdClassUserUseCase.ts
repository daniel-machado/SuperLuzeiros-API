import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const getByIdClassUserUseCase = async (
  id: string,
  userClassRepository: IUserClassRepository, 
) => {

  const classOne = await userClassRepository.findById(id);

  return {
    classOne
  };
}
