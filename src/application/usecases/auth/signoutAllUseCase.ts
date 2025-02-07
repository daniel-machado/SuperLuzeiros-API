import { IRefreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';
import { revokeAllTokensForUser, verifyRefreshToken } from '../../../application/services/tokenService';

interface LoginResult {
  message: string
}

export const signoutAllUseCase = async (
  token: string,
  refreshTokenRepository: IRefreshTokenRepository,
): Promise<LoginResult> => {

  if (!token) throw new Error('Refresh token required');

  const existingToken = await refreshTokenRepository.findByToken(token);
  if (!existingToken) throw new Error("Invalid refresh token");

  const userId = verifyRefreshToken(existingToken.token);
  await revokeAllTokensForUser(userId)

  return {
    message: 'Logged out from all devices - successfully',
  };

}


