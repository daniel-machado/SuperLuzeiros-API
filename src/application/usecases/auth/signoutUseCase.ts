import { IRefreshTokenRepository, refreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';
import { revokeRefreshToken } from '../../../application/services/tokenService';

interface LoginResult {
  message: string
}

export const signoutUseCase = async (
  token: string,
  refreshTokenRepository: IRefreshTokenRepository,
): Promise<LoginResult> => {

  if (!token) throw new Error('Refresh token required');

  const existingToken = await refreshTokenRepository.findByToken(token);
    if (!existingToken) throw new Error("Invalid refresh token");

  await revokeRefreshToken(token)

  return {
    message: 'Logged in successfully',
  };

}


