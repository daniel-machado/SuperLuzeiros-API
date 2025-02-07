// src/application/use-cases/auth/sendVerificationCodeUseCase.ts
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';
import { sendEmail } from '../../../infrastructure/mail/sendMail'
import { hashingService } from '../../../infrastructure/hashing/hashingService'

export const sendVerificationCodeUseCase = async (
    email: string,
    userRepository: IUserRepository,
): Promise<string> => {
    
  // Busca o usuário
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User does not exist!');
    }

    // Verifica se já está verificado
    if (user.isVerified) {
        throw new Error('You are already verified!');
    }

    // Gera o código de verificação
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    // Envia o e-mail
    const emailSent = await sendEmail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS as string,
      to: user.email,
      subject: 'Verification Code',
      html: `<h1>${codeValue}</h1>`,
    });
  
    if (!emailSent) {
      throw new Error('Code sending failed!');
    }

    // Salva o código criptografado no banco de dados
    const hashedCodeValue = hashingService.hmac(
      codeValue, 
      process.env.HMAC_VERIFICATION_CODE_SECRET as string
    );
    user.verificationCode = hashedCodeValue;
    user.verificationCodeValidation = Date.now();
    await userRepository.updateUser(user.id as string, {
        verificationCode: hashedCodeValue,
        verificationCodeValidation: Date.now(),
    });

    return 'Code sent!';
};