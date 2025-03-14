import express, { Router } from 'express';

import { quizAnswerController } from '../../interfaces/controllers/quizAnswerController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.create
); 

router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.getAll
); 

router.get('/list-one/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.getById
); 

router.get('/question/:questionId', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.getQuestionId
); 

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizAnswerController.delete
); 

export default router;
