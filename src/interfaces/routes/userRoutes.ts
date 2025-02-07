import express, { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Rotas de autenticação
router.get('/users',
  authenticate,
  authorize(['admin', 'director']),
  UserController.GetAllUsers
);

router.get('/users-pending',
  authenticate,
  authorize(['admin', 'director']),
  UserController.pendingUsers
);


router.patch('/approve-user/:userId',
            authenticate,
            authorize(['admin', 'director']),
            UserController.approveUser
          );

export default router;
