
import { IUserAttributes } from '../../../infrastructure/database/models/User';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';

export const pendingUserUseCase = async (
  userRepository: IUserRepository,
): Promise<any> => {

  const usersPending = await userRepository.findUserByStatusPending();
  return {
    usersPending
  };
}