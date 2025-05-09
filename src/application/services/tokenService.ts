// src/application/services/tokenService.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { refreshTokenRepository } from '../../infrastructure/database/repositories/refreshTokenRepository'

// Assegura que as variáveis de ambiente não sejam undefined
const { TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env;

if (!TOKEN_SECRET || !JWT_EXPIRES_IN || !REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error('Missing one or more environment variables: TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN');
}

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '4h', })
};

export const generateRefreshToken =  (userId: string): string => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

// Revoga um token específico
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await refreshTokenRepository.deleteByToken(token);
};

// Revoga todos os tokens de um usuário
export const revokeAllTokensForUser = async (userId: string): Promise<void> => {
  await refreshTokenRepository.deleteByUserId(userId);
};


// export const verifyToken = async (token: string): Promise<userId: string> => {
//   try {
//     // Verifica se o token é válido e decodifica
//     const decoded = jwt.verify(token, TOKEN_SECRET as string,) as { id: string } as { userId: string };
//     if (!decoded || !decoded.id) {
//       throw new Error('Invalid token or missing user ID');
//     }
//     const userId = decoded.id;
//     return userId;
//   } catch (error) {
//     console.error('Error', error);
//     throw new Error('Invalid token');
//   }
// };


