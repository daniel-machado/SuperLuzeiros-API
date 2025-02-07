// src/application/use-cases/auth/sendVerificationCodeUseCase.ts
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';
import { sendEmail } from '../../../infrastructure/mail/sendMail'
import { hashingService } from '../../../infrastructure/hashing/hashingService'

export const requestDeleteAccountUseCase = async (
    id: string,
    userRepository: IUserRepository,
): Promise<string> => {
    
// Busca o usuário
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error('User does not exist!');
  }

  // Gera o código de verificação
  const codeValue = Math.floor(Math.random() * 1000000).toString();

  // Enviar e-mail com o código
  const emailSent = await sendEmail({
    from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS!,
    to: user.email,
    subject: 'Confirmação de exclusão de conta',
    html: `<p>Seu código de confirmação é: <strong>${codeValue}</strong></p>`,
  });
  
  if (!emailSent) {
    throw new Error('Code sending failed!');
  }

    // Salva o código criptografado no banco de dados
    const hashedCodeValue = hashingService.hmac(
      codeValue, 
      process.env.HMAC_VERIFICATION_CODE_SECRET as string
    );
    user.deleteAccountCode  = hashedCodeValue;
    user.deleteAccountCodeValidation = Date.now();
    await userRepository.updateUser(user.id as string, {
      deleteAccountCode: hashedCodeValue,
      deleteAccountCodeValidation: Date.now(),
    });

    return 'Code sent!';
};