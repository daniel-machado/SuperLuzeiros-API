import express, { Router } from 'express';

import { IndividualQuestionsController } from '../controllers/IndividualQuestionsController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-question', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualQuestionsController.createQuestion
); 

// list all evaluation
router.get('/list-questions', 
  authenticate,
  //authorize(['admin', 'director']),
  IndividualQuestionsController.listQuestion
); 

// Update evaluation
router.put('/update-question/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualQuestionsController.updateQuestion
); 

// delete evaluation
router.delete('/delete-question/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualQuestionsController.deleteQuestion
); 

export default router;


