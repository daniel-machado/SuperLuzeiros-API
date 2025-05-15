import express, { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Rotas de autenticação
router.get('/users',
  authenticate,
  //authorize(['admin', 'director']),
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

router.get('/me', 
  authenticate,
  UserController.me
);

router.get('/get-user/:userId', 
  authenticate,
  UserController.getUser
);

export default router;


// async me(req: Request, res: Response) {
//   try {
//     const userId = req.user?.id; // O middleware de autenticação deve adicionar req.user
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Usuário não autenticado" });
//     }

//     const user = await UserRepository.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "Usuário não encontrado" });
//     }

//     res.json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Erro interno no servidor" });
//   }
// }
