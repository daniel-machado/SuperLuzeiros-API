import express, { Router } from 'express';

import { classController } from '../../interfaces/controllers/classController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  authorize(['admin', 'director']),
  classController.create
); 

router.get('/list-all', 
  authenticate,
  //authorize(['admin', 'director']),
  classController.getAllClass
); 

router.get('/list-class-type', 
  authenticate,
  //authorize(['admin', 'director']),
  classController.getByType
);

router.get('/list-one-id/:id', 
  authenticate,
  //authorize(['admin', 'director']),
  classController.getById
);

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  classController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  classController.delete
); 

export default router;
