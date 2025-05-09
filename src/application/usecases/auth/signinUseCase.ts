import { generateAccessToken, generateRefreshToken } from '../../../application/services/tokenService';
import { IRefreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';
//import { IUserAttributes } from '../../../infrastructure/database/models/User';
import { IHashingService } from '../../../infrastructure/hashing/hashingService';

interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export const signInUseCase = async (
  email: string, 
  password: string, 
  userRepository: IUserRepository, 
  hashingService: IHashingService,
  refreshTokenRepository: IRefreshTokenRepository,
): Promise<LoginResult> => {

  // Validar email e senha
  if (!email || !password) {
    throw new Error('Email and password are required!');
  };

  // Verificar se o usuário existe
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('User does not exist!');
  }
  
  // if (!user || !(await hashingService.compare(password, user.password))) { // Pode usar isso aqui para melhorar a segurança, pois usa as duas verificações
  //   throw new Error("Invalid credentials");
  // }

  // Validar a senha
  const isPasswordValid = await hashingService.compare(password, user.password);
  if (!isPasswordValid) {
      throw new Error('Invalid credentials!');
  }

  if (!user.id) {
    throw new Error("User ID is undefined, cannot generate refresh token.");
  }

  const accessToken = generateAccessToken({ 
    userId: user.id, 
    email: user.email, 
    role: user.role,
    name: user.name,
    birthDate: user.birthDate,
    isActive: user.isActive,
    isVerified: user.isVerified,
    photoUrl: user.photoUrl,
    status: user.status,
    verificationCode:user.verificationCode,
    verificationCodeValidation: user.verificationCodeValidation,
    forgotPasswordCodeValidation: user.forgotPasswordCodeValidation,
    forgotPasswordCode: user.forgotPasswordCode,
  });
  
  const refreshToken = generateRefreshToken(user.id as string);

  await refreshTokenRepository.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  })

  return {
    accessToken,
    refreshToken,
  };

}


