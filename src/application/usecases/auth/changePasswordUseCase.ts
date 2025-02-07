import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../../infrastructure/hashing/hashingService'
import { ValidationError } from '../../errors/validationError'


export const changePasswordUseCase = async (
  userId: string,
  verified: boolean,
  oldPassword: string,
  newPassword: string,
  userRepository: IUserRepository,
): Promise<string> => {

  if (!verified) {
    throw new ValidationError('You are not a verified user!');
  }

  const user = await userRepository.findUserByIdWithPassword(userId);
  if (!user) {
    throw new ValidationError('User does not exist!');
  }

  const isPasswordValid = await hashingService.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new ValidationError('Invalid credentials!');
  }

  const hashedPassword = await hashingService.hash(newPassword, 12);
  await userRepository.updateUser(user.id as string, { password: hashedPassword });

  return 'Password updated!';
};