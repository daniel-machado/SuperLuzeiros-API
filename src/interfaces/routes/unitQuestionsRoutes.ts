import express, { Router } from 'express';

import { UnitQuestionsController } from '../controllers/UnitQuestionsController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-question', 
  authenticate,
  authorize(['admin', 'director']),
  UnitQuestionsController.createUnitQuestion
); 

// list all evaluation
router.get('/list-questions', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitQuestionsController.listUnitQuestion
); 

// Update evaluation
router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitQuestionsController.updateUnitQuestion
); 

// delete evaluation
router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitQuestionsController.deleteUnitQuestion
); 
export default router;


