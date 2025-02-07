import { sendEmail } from '../../../infrastructure/mail/sendMail';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../../infrastructure/hashing/hashingService'
import { ValidationError } from '../../errors/validationError'


export const sendForgotPasswordCodeUseCase = async (
  email: string,
  userRepository: IUserRepository,
): Promise<void> => {
  
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new ValidationError('User does not exist!');
  }

  const codeValue = Math.floor(Math.random() * 1000000).toString();

  const emailSent = await sendEmail({
    from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS as string,
    to: user.email,
    subject: 'Forgot Password Code',
    html: `<h1>${codeValue}</h1>`,
  });

  if (!emailSent) {
    throw new Error('Code sending failed!');
  }

  const hashedCodeValue = hashingService.hmac(
    codeValue,
    process.env.HMAC_VERIFICATION_CODE_SECRET as string
  );

  await userRepository.updateUser(user.id as string, {
    forgotPasswordCode: hashedCodeValue,
    forgotPasswordCodeValidation: Date.now(),
  });
};
