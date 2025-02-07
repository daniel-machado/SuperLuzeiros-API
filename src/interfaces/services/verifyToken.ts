// src/application/services/tokenService.ts
import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): { userId: string} => {
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET as string) as { userId: string };
    } catch (error) {
        throw new Error('Invalid token');
    }
};