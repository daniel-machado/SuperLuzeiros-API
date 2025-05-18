import { IUserAttributes } from "../../../infrastructure/database/models/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";

export const updateUserUseCase = async (
  userId: string,
  data: IUserAttributes,
  userRepository: IUserRepository
) => {
  
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error("User não encontrado!");

  const userUpdate = await userRepository.updateUser(userId, data)

  return {
    userUpdate
  };

}
