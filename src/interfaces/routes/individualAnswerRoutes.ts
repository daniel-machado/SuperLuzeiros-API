import express, { Router } from 'express';

import { IndividualAnswerController } from '../controllers/individualAnswerController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-answer', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualAnswerController.createAnswer
); 

// list all evaluation
router.get('/list-answer/:dbvId', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualAnswerController.listAnswer
); 

// list all evaluation
router.get('/list-all-answers', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualAnswerController.listAllAnswer
); 

// delete evaluation
router.delete('/delete-answer/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualAnswerController.deleteAnswer
); 


export default router;


