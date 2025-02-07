
import { Request, Response } from 'express';
import moment from 'moment';

import { UserRepository } from '../../infrastructure/database/repositories/UserRepository'
import { hashingService } from '../../infrastructure/hashing/hashingService';
import { refreshTokenRepository } from '../../infrastructure/database/repositories/refreshTokenRepository'

// Use cases
import { signupUseCase } from '../../application/usecases/auth/signupUseCase';
import { signInUseCase } from '../../application/usecases/auth/signinUseCase';
import { refreshTokenUseCase } from '../../application/usecases/auth/refreshTokenUseCase';
import { signoutUseCase } from '../../application/usecases/auth/signoutUseCase';
import { signoutAllUseCase } from '../../application/usecases/auth/signoutAllUseCase';
import { sendVerificationCodeUseCase } from '../../application/usecases/auth/sendVerificationCodeUseCase';
import { verifyVerificationCodeUseCase } from '../../application/usecases/auth/verifyVerificationCodeUseCase';
import { changePasswordUseCase } from '../../application/usecases/auth/changePasswordUseCase';
import { sendForgotPasswordCodeUseCase } from '../../application/usecases/auth/sendForgotPasswordCodeUseCase';
import { verifyForgotPasswordCodeUseCase } from '../../application/usecases/auth/verifyForgotPasswordCodeUseCase';
import { requestDeleteAccountUseCase } from '../../application/usecases/auth/requestDeleteAccountUseCase';
import { confirmDeleteAccountUseCase } from '../../application/usecases/auth/confirmDeleteAccountUseCase';

export const AuthController = {
  //Signup - Register
  async signup(req: Request, res: Response): Promise<void>  {
    const { name, email, password, confirmPassword, photoUrl } = req.body;

    // Verifica se as senhas corretas
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const birthDate = moment(req.body.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
    try {
      // Chamando o caso de uso com as dependências
      const result = await signupUseCase(
        {
          name, email, password, birthDate, photoUrl,
          isActive: false,
          isVerified: false,
        },
        UserRepository,
        hashingService
      );

      res.status(201).json({
        success: true,
        message: 'Your account has been created successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Signin - Login
  async signin(req: Request, res: Response): Promise<void>  {
    const { email, password } = req.body;
    try {
      const result = await signInUseCase(email, password, UserRepository, hashingService );
      
      // Configura os cookies
      res.cookie('Authorization', `Bearer ${result.accessToken}`, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      });

      res.cookie('RefreshToken', result.refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        message: result.message,
      });

    } catch (error: any) {
      console.log('Error in signin: ', error);
      res.status(400).json({  success: false, message: `${error.message}`  });
    }
  },

  // Refresh Token - Renovar token
  async refreshToken(req: Request, res: Response): Promise<void>  {
    const refreshToken = req.cookies['RefreshToken'];
    try {
      const newToken = await refreshTokenUseCase (refreshToken, refreshTokenRepository);

      res.cookie('Authorization', `Bearer ${newToken}`, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      });
      res.status(200).json({
        success: true,
        accessToken: newToken,
      });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
  },

  // Logout - Sair
  async signout(req: Request, res: Response): Promise<void>  {
    const refreshToken = req.cookies['RefreshToken'];
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'No refresh token provided' });
      return
    }
    try {
      await signoutUseCase(refreshToken, refreshTokenRepository);
      res.clearCookie('Authorization');
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error during sign out from all devices:', error);
      res.status(500).json({ success: false, message: 'An error occurred during logout.' });
    }
  },

  // SignoutAll - Sair de todos os dispositivos
  async signoutAll(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies['RefreshToken'];
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'No refresh token provided' });
      return
    }
    try {
      await signoutAllUseCase(refreshToken, refreshTokenRepository);
      res.clearCookie('RefreshToken');
      res.status(200).json({ success: true, message: 'Logged out from all devices' });
    } catch (error) {
      console.error('Error during sign out from all devices:', error);
      res.status(500).json({ success: false, message: 'Failed to log out from all devices' });
    }
  },

  // Send Verification Code
  async sendVerificationCode(req: Request, res: Response): Promise<void>{
    const { email } = req.body;
    try {
      const result = await sendVerificationCodeUseCase(email, UserRepository);
      res.status(200).json({ success: true, message: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Verify Verification Code
  async verifyVerificationCode(req: Request, res: Response): Promise<void>{
    const { email, providedCode } = req.body;
    try {
      const message = await verifyVerificationCodeUseCase(
        email,
        providedCode,
        UserRepository,
      );
      res.status(200).json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Change Password
  async changePassword(req: Request, res: Response): Promise<void>{
    const { id, isVerified } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
      const message = await changePasswordUseCase(
        id, 
        isVerified, 
        oldPassword, 
        newPassword, 
        UserRepository
      );
      res.status(200).json({ success: true, message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  },

  // Send Forgot Password Code
  async sendForgotPasswordCode(req: Request, res: Response): Promise<void>{
    const { email } = req.body;

  try {
    await sendForgotPasswordCodeUseCase(email, UserRepository);
    res.status(200).json({ success: true, message: 'Code sent!' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  },

  // Verify Forgot Password Code
  async verifyForgotPasswordCode(req: Request, res: Response): Promise<void>{
    const { email, providedCode, newPassword } = req.body;
    try {
      const result = await verifyForgotPasswordCodeUseCase(
        email, 
        providedCode, 
        newPassword, 
        UserRepository);
      res.status(200).json({ success: true, message: result });
    } catch (error: any) {
      res.status(error.status || 400).json({ success: false, message: error.message });
    }
  },   
  async requestDeleteAccount(req: Request, res: Response): Promise<void> {
    const { id } = req.user;
    try {
      const result = await requestDeleteAccountUseCase(id, UserRepository);
      res.status(200).json({ success: true, message: result });
      return
    } catch (error) {
      console.error('Erro ao solicitar exclusão de conta:', error);
      res.status(500).json({ success: false, message: 'Erro ao solicitar exclusão de conta' });
      return
    }
  },

  async confirmDeleteAccount(req: Request, res: Response): Promise<void> {
    const { id } = req.user;
    const { code } = req.body;
    try {
      const result = await confirmDeleteAccountUseCase(id, code, UserRepository);
      res.status(200).json({ success: true, message: result });
      return
    } catch (error) {
      console.error('Erro ao confirmar exclusão de conta:', error);
      res.status(500).json({ success: false, message: 'Erro ao excluir conta' });
      return
    }
  }
}