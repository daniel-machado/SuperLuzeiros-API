import { IRefreshTokenRepository, refreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';
import { generateAccessToken, verifyRefreshToken } from '../../../application/services/tokenService';

interface LoginResult {
  message: string
  newAccessToken: string
}

export const refreshTokenUseCase = async (
  token: string,
  refreshTokenRepository: IRefreshTokenRepository,
): Promise<LoginResult> => {

  const existingToken = await refreshTokenRepository.findByToken(token);
    if (!existingToken) throw new Error("Invalid refresh token");

  // Verifica o Refresh Token
  const userId = verifyRefreshToken(token);

  // Gera um novo Access Token
  const newAccessToken = generateAccessToken({ userId });

  return {
    message: 'Refresh Token Regenerate',
    newAccessToken
  };

}


