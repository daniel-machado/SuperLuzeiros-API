import express, { Router } from 'express';

import { quizController } from '../../interfaces/controllers/quizController'; 

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  quizController.create
); 

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizController.delete
); 

router.get('/list', 
  authenticate,
  //authorize(['admin', 'director']),
  quizController.getAllQuiz
); 

router.get('/list-quiz-specialty/:specialtyId', 
  authenticate,
  //authorize(['admin', 'director']),
  quizController.getBySpecialty
); 

router.get('/quiz/:id', 
  authenticate,
  //authorize(['admin', 'director']),
  quizController.getQuiz
); 

export default router;
