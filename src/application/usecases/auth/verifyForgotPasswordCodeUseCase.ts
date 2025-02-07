import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../../infrastructure/hashing/hashingService'
import { ValidationError } from '../../errors/validationError';

export const verifyForgotPasswordCodeUseCase = async (
  email: string,
  providedCode: string,
  newPassword: string,
  userRepository: IUserRepository,
): Promise<string> => {

  // Busca do usuário no banco
  const existingUser = await userRepository.findByEmailWithForgotPasswordCode(email);
  if (!existingUser) {
    throw new ValidationError('User does not exist!');
  }

  // Validações adicionais do código
  if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
    throw new ValidationError('Something is wrong with the code!');
  }

  if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
    throw new ValidationError('Code has expired!');
  }

  // Verificar o código
  const hashedCodeValue = hashingService.hmac(
    providedCode.toString(),
    process.env.HMAC_VERIFICATION_CODE_SECRET as string
  );

  if (hashedCodeValue !== existingUser.forgotPasswordCode) {
    throw new ValidationError('Invalid code provided!');
  }

  // Atualizar a senha
  const hashedPassword = await hashingService.hash(newPassword, 12);
  await userRepository.updateUser(existingUser.id as string, {
    password: hashedPassword,
    forgotPasswordCode: undefined,
    forgotPasswordCodeValidation: undefined,
  });

  return 'Password updated!';
};
