// src/application/use-cases/auth/verifyVerificationCodeUseCase.ts
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../../infrastructure/hashing/hashingService'
import { ValidationError } from '../../errors/validationError';

export const confirmDeleteAccountUseCase = async (
  id: string,
  code: string,
  userRepository: IUserRepository,
): Promise<string> => {

  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new ValidationError('User does not exist!');
  }

  if (user.deleteAccountCode !== code) {
    throw new ValidationError('Código inválido' );
  } else {
    await userRepository.deleteUser(user.id as string); // Excluir conta
    return 'Conta excluída com sucesso.'
  }
};