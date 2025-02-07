/// <reference path="../../shared/express.d.ts" />

import { Request, Response, NextFunction } from 'express';

export const authorize = (allowedRoles: Array<'pending' | 'admin' | 'dbv' | 'director' | 'lead' | 'counselor' | 'secretary'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('User in request:', req.user); // 👀 Verifique se o usuário está sendo passado corretamente
    
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Access is denied',
      });
      return;
    }
    next();
  };
};
