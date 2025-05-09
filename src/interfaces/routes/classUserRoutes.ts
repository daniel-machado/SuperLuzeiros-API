import express, { Router } from 'express';

import { ClassUserController } from '../../interfaces/controllers/classUserController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  ClassUserController.create
); 

router.get('/list-all', 
  authenticate,
  //authorize(['admin', 'director']),
  ClassUserController.getAll
); 

router.get('/list-one-class/:id', 
  authenticate,
  //authorize(['admin', 'director']),
  ClassUserController.getOneById
); 

router.get('/list-user-class', 
  authenticate,
  //authorize(['admin', 'director']),
  ClassUserController.getByUserAndClass
); 

router.get('/list-user-all/:userId', 
  authenticate,
  //authorize(['admin', 'director']),
  ClassUserController.getAllByUser
); 

router.get('/list-class-all', 
  authenticate,
  //authorize(['admin', 'director']),
  ClassUserController.getAllByClass
); 

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  ClassUserController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  ClassUserController.delete
); 

export default router;
