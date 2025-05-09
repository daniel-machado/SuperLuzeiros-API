import { User } from "../models";
import { RefreshToken, IRefreshToken, IRefreshTokenCreationAttributes  } from "../models/RefreshToken";


export interface IRefreshTokenRepository {
  create({token, userId, expiresAt}: IRefreshToken): Promise<IRefreshToken>;
  findByToken(token: string): Promise<IRefreshToken | null>;
  deleteByToken(token: string): Promise<number>;
  deleteByUserId(userId: string): Promise<boolean>;
}

export const refreshTokenRepository = {
  create: async ({token, userId, expiresAt}: IRefreshToken): Promise<IRefreshToken> => {
    return await RefreshToken.create({ token, userId, expiresAt });
  },

  findByToken: async (token: string): Promise<IRefreshToken | null> =>{
    return await RefreshToken.findOne({ 
      where: { token }, 
      include: [{ 
        model: User,
        as: 'refreshUser'
      }]
    });
  },

  deleteByToken: async (token: string): Promise<number> => {
    return await RefreshToken.destroy({ where: { token } });
  },

  deleteByUserId: async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.error('User ID is missing');
      return false;
    }
    try {
      // Remove todos os refresh tokens do banco de dados
      await RefreshToken.destroy({ where: { userId } });

      return true;
    } catch (error) {
      console.error('Error while invalidating refresh tokens:', error);
      return false;
    }
  }
};
