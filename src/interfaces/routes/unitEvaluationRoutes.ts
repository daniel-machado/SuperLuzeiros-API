import express, { Router } from 'express';

import { UnitEvaluationController } from '../controllers/UnitEvaluationController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-evaluation', 
  authenticate,
  authorize(['admin', 'director']),
  UnitEvaluationController.createUnitEvaluation
); 

// Calculate Point
router.get('/calculate-point', 
  authenticate,
  authorize(['admin', 'director']),
  UnitEvaluationController.calculateUnitEvaluation
); 
// list all evaluation
router.get('/list-all', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitEvaluationController.listUnitEvaluation
); 

// list by ID
router.get('/list/:id', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitEvaluationController.listUnitEvaluationGetById
); 

// list all evaluation unit
router.get('/list-all-evaluation-unit/:unitId', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitEvaluationController.listUnitEvaluationFromUnit
); 

// list all evaluation Active by Id
router.get('/evaluation-active/:unitId', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitEvaluationController.listActiveEvaluationByUnitId
); 

// list all evaluation unit Active
router.get('/evaluations-actives', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitEvaluationController.listActiveUnitEvaluationAll
); 

// Update evaluation
router.patch('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitEvaluationController.updateUnitEvaluation
); 

// delete evaluation
router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitEvaluationController.deleteUnitEvaluation
); 

export default router;


