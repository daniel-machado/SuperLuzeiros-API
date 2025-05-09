
import { IUserAttributes } from '../../../infrastructure/database/models/User';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';

export const FindMeUseCase = async (
  userId: string,
  userRepository: IUserRepository,
): Promise<any> => {
  
  const user = await userRepository.findUserById(userId);

  return {
    user
  };
}