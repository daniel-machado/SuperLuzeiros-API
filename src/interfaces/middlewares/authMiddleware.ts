
/// <reference path="../../shared/express.d.ts" />

// src/interfaces/middlewares/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../application/services/tokenService';
import { User } from '../../infrastructure/database/models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.error("🚨 Nenhum cabeçalho 'Authorization' encontrado.");
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next(); // 🚀 Importante: Certifique-se de chamar `next()` para continuar o fluxo
  } catch (error) {
    console.error("❌ Erro ao verificar o token:", error);
    res.status(401).json({ success: false, message: 'Invalid Token.' });
  }
};

// export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '')

//   if (!token) {
//     res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
//     return;
//   }

//   try {
//     const decoded = verifyToken(token)  
//     req.user = decoded;
//     next();

//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ success: false, message: 'Invalid Token.' });
//     }
// };
