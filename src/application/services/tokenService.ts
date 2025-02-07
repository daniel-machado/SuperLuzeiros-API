// src/application/services/tokenService.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { refreshTokenRepository } from '../../infrastructure/database/repositories/refreshTokenRepository'

// Assegura que as variáveis de ambiente não sejam undefined
const { TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env;

if (!TOKEN_SECRET || !JWT_EXPIRES_IN || !REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error('Missing one or more environment variables: TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN');
}

export const generateAccessToken = (payload: object): string => {
  //return jwt.sign(payload, TOKEN_SECRET as string, { expiresIn: JWT_EXPIRES_IN || '1h' } // Investigar depois
  return jwt.sign(payload, TOKEN_SECRET as string);
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  //const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN }); // Depois investigar
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET);
  const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

  await refreshTokenRepository.create(userId, refreshToken, expirationDate);
  return refreshToken;
};

export const verifyRefreshToken = (token: string): string => {
  try {
    // Verifica se o refresh token é válido e decodifica
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token or missing user ID');
    }
    const userId = decoded.id;
    return userId;
  } catch (error) {
    console.error('Error during signout from all devices:', error);
    throw new Error('Invalid refresh token');
  }
};

// Revoga um token específico
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await refreshTokenRepository.deleteByToken(token);
};

// Revoga todos os tokens de um usuário
export const revokeAllTokensForUser = async (userId: string): Promise<void> => {
  await refreshTokenRepository.deleteByUserId(userId);
};
