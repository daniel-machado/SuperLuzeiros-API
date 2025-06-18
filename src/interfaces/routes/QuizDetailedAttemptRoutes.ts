// infrastructure/routes/quizDetailedAttemptRoutes.ts
import express, { Router } from 'express';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';
import { quizDetailedAttemptController } from '../../interfaces/controllers/quizDetailedAttemptController'

const router: Router = express.Router();

router.post('/', 
  authenticate,
  //authorize(['admin', 'director']), 
  quizDetailedAttemptController.create
);
  
router.get('/attempt/:attemptId', 
  authenticate,
  //authorize(['admin', 'director']), 
  quizDetailedAttemptController.findByAttemptId
);
router.get('/user/:userId/quiz/:quizId', 
  authenticate,
  //authorize(['admin', 'director']), 
  quizDetailedAttemptController.findByUserAndQuiz
);
router.get('/user/:userId', 
  authenticate,
  //authorize(['admin', 'director']), 
  quizDetailedAttemptController.findByUser
);

export default router;

