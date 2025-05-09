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

router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  quizAttemptController.getAll
);

router.get('/list-one/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAttemptController.getById
);

router.get('/user/:userId/quiz/:quizId',
  authenticate,
  authorize(['admin', 'director']),
  quizAttemptController.getUserAttempts
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
