import { IRefreshTokenRepository, refreshTokenRepository } from '../../../infrastructure/database/repositories/refreshTokenRepository';

export const signoutUseCase = async (
  token: string,
  refreshTokenRepository: IRefreshTokenRepository,
) => {

  if (!token) throw new Error('Refresh token required');
  await refreshTokenRepository.deleteByToken(token);
}


