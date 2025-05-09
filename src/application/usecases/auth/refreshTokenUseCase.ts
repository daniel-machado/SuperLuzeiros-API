import { IRefreshTokenRepository, refreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';
import { generateAccessToken, verifyRefreshToken } from '../../../application/services/tokenService';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';

interface LoginResult {
  newAccessToken: string
}

export const refreshTokenUseCase = async (
  token: string,
  refreshTokenRepository: IRefreshTokenRepository,
  userRepository: IUserRepository,
): Promise<LoginResult> => {

  const existingToken = await refreshTokenRepository.findByToken(token);
  if (!existingToken || new Date(existingToken.expiresAt).getTime() < Date.now()) {
      throw new Error("Invalid  or expired refresh token");
    } 
  
  const user = await userRepository.findUserById(existingToken.userId);
  if (!user){
    throw new Error("User Not Found in Refresh Token");
  } 

  // Gera um novo Access Token
  const newAccessToken = generateAccessToken({ 
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

  return {
    newAccessToken
  };

}


