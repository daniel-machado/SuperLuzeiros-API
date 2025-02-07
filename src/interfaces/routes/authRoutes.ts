import express, { Router } from 'express';

import { validate } from '../middlewares/validate'

import { AuthController } from '../controllers/AuthController';
import { 
  signupSchema, 
  signinSchema, 
  acceptCodeSchema, 
  changePasswordSchema, 
  forgotPasswordSchema, 
  acceptFPCodeSchema  
} from '../../application/validators/authValidator';
import { authenticate } from '../../interfaces/middlewares/authMiddleware';

const router: Router = express.Router();

// Rotas de autenticação
router.post('/signup', 
            validate(signupSchema), 
            AuthController.signup
          );

router.post('/signin', 
            validate(signinSchema),
            AuthController.signin
          );

router.post('/refresh-token',  
            AuthController.refreshToken
          );

router.post('/signout', 
            authenticate, 
            AuthController.signout
          );

router.post('/signout-all', 
            authenticate,
            AuthController.signoutAll
          );

router.patch('/send-verification-code', 
              authenticate,  
              AuthController.sendVerificationCode
            );

router.patch('/verify-verification-code', 
              authenticate, 
              validate(acceptCodeSchema), 
              AuthController.verifyVerificationCode
            ); 

router.patch('/change-password', 
              authenticate, 
              validate(changePasswordSchema), 
              AuthController.changePassword
            );

router.patch('/send-forgot-password-code', 
              validate(forgotPasswordSchema), 
              AuthController.sendForgotPasswordCode
            );

router.patch('/verify-forgot-password-code', 
              validate(acceptFPCodeSchema), 
              AuthController.verifyForgotPasswordCode
            );

router.post('/request-delete-account', 
              authenticate, 
              AuthController.requestDeleteAccount
            );

router.delete('/confirm-delete-account', 
                authenticate, 
                validate(acceptCodeSchema), 
                AuthController.confirmDeleteAccount
              );


export default router;


