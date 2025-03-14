import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const deleteClassUserUseCase = async (
  id: string,
  userClassRepository: IUserClassRepository, 
) => {

  const deleteClassUser = await userClassRepository.delete(id);

  return {
    deleteClassUser
  };
}
