import express, { Router } from 'express';

import { UnitAnswerController } from '../controllers/UnitAnswerController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-answer', 
  authenticate,
  authorize(['admin', 'director']),
  UnitAnswerController.createUnitAnswer
); 

// list all evaluation
router.get('/list-questions/:unitId', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitAnswerController.listUnitAnswer
); 

// list all evaluation
router.get('/list-all-answers', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitAnswerController.listUnitAnswerAll
); 


// delete evaluation
router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitAnswerController.deleteUnitAnswer
); 

export default router;


