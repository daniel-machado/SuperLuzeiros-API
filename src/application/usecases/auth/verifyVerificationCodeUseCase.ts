// src/application/use-cases/auth/verifyVerificationCodeUseCase.ts
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../../infrastructure/hashing/hashingService'
import { ValidationError } from '../../errors/validationError';

export const verifyVerificationCodeUseCase = async (
  email: string,
  providedCode: string,
  userRepository: IUserRepository,
): Promise<string> => {

  if (!email || !providedCode) {
    throw new ValidationError('Email and code are required!');
  }

  const existingUser = await userRepository.findByEmailWithVerificationCode(email);

  if (!existingUser) {
    throw new ValidationError('User does not exist!');
  }

  if (existingUser.isVerified) {
    throw new ValidationError('You are already verified!');
  }

  if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
    throw new ValidationError('Something is wrong with the code!');
  }

  if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
    throw new ValidationError('Code has expired!');
  }

  const hashedCodeValue = hashingService.hmac(
    providedCode, 
    process.env.HMAC_VERIFICATION_CODE_SECRET as string
  );

  if (hashedCodeValue === existingUser.verificationCode) {
    await userRepository.updateUser(existingUser.id as string, {
      isVerified: true,
      verificationCode: undefined,
      verificationCodeValidation: undefined,
    });
    return 'Your account has been verified!'
  }
  
  throw new ValidationError('Unexpected error occurred!');
};