import express, { Router } from 'express';

import { quizAttemptController } from '../../interfaces/controllers/quizAttemptController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/submit',
  authenticate,
  //authorize(['admin', 'director']), 
  quizAttemptController.create
);

// Listar todas as tentativas de quiz
router.get('/list-all', 
  authenticate,
  // authorize(['admin', 'director']),
  quizAttemptController.getAll
);

// Listar tentativa de quiz por ID
router.get('/list-one/:id', 
  authenticate,
  // authorize(['admin', 'director']),
  quizAttemptController.getById
);

//Todas as tentativas de um usuário em um quiz específico
router.get('/user/:userId/quiz/:quizId',
  authenticate,
  // authorize(['admin', 'director']),
  quizAttemptController.getUserAttempts
);

//  Todas as tentativas de um usuário
router.get('/user/:userId',
  authenticate,
  // authorize(['admin', 'director']),
  quizAttemptController.getUserAttemptsById
);

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAttemptController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAttemptController.delete
); 

export default router;
