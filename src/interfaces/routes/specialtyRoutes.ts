import express, { Router } from 'express';

import { specialtyController } from '../../interfaces/controllers/specialtyController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.create
); 

router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.getAllSpecialty
); 

router.get('/list-category', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.getByCategory
); 

router.get('/list-one-specialty/:id', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.getById
); 

router.get('/list-level/:level', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.getByLevel
); 

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  specialtyController.delete
); 

export default router;
