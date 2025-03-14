import express, { Router } from 'express';

import { quizQuestionController } from '../../interfaces/controllers/quizQuestionController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.create
); 

router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.getAll
);

router.get('/list-question/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.getById
);

router.get('/quiz-all-questions/:quizId', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.getAllByQuizId
);

router.get('/quiz/:quizId/random', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.getRandom
);

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizQuestionController.delete
); 


export default router;
