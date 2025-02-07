
import { IUserAttributes } from '../../../infrastructure/database/models/User';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';

export const getAllUsersUseCase = async (
  userRepository: IUserRepository,
): Promise<any> => {
  
  const users = await userRepository.findAllUsers();

  return {
    users
  };
}