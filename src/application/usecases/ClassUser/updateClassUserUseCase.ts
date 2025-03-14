import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";

export const updateClassUserUseCase = async (
  id: string,
  data: IUserClass,
  userClassRepository: IUserClassRepository, 
) => {

  if (!id) throw new Error('id this associate class is required');

  const existingUserClass = await userClassRepository.findById(id)
  if (!existingUserClass) throw new Error("Not existing user class!");

  const associateClass = await userClassRepository.update(id, data);
  if (!associateClass) throw new Error("Not existing user specialty!");

  return {
    associateClass
  };

}


