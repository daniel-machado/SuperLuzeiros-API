
/// <reference path="../../shared/express.d.ts" />

// src/interfaces/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/verifyToken';
import { User } from '../../infrastructure/database/models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Determina se o cliente é um navegador ou outro tipo de client
    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    }

    if (!token) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
    }

    try {
        // Extrai o token Bearer
        const userToken = token.split(' ')[1];

        // Usa o serviço verifyToken para validar o token e extrair informações
        const { userId } = verifyToken(userToken);
        
        const user = await User.findByPk(userId); // Buscar usuário no banco
        
        if (!user) {
          res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
          return
        }

        req.user = user; // Definindo o usuário no request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
