import express, { Router } from 'express';

import { IndividualEvaluationController } from '../controllers/IndividualEvaluationController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Criar evaluation
router.post('/create-evaluation', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.createEvaluation
); 

// list all evaluation
router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.listEvaluations
); 

// list by ID
router.get('/individual-evaluation/:Id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.listOneEvaluationById
); 

// list all evaluation unit
router.get('/list-all-evaluation/:userId', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.listAllEvaluationByUser
); 

// list all evaluation Active by Id
router.get('/evaluation-active/:userId', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.listActiveEvaluationByUser
); 

// list all evaluation unit Active
router.get('/evaluations-actives', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.listActiveUnitEvaluationAll
); 

// Update evaluation
router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.updateEvaluation
); 

// delete evaluation
router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualEvaluationController.deleteEvaluation
); 

export default router;


