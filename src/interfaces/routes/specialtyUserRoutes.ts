import express, { Router } from 'express';

import { SpecialtyUserController } from '../../interfaces/controllers/SpecialtyUserController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

router.post('/create', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.create
); 

router.get('/list', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.getAll
); 

router.get('/list-one/:id', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.getOneById
);

router.get('/list-user-and-specialty/user/:userId/specialty/:specialtyId', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.getByUserAndSpecialty
);

router.get('/list-all-user/:userId', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.getAllByUser
);

router.get('/list-all-specialty/:specialtyId', 
  authenticate,
  //authorize(['admin', 'director']),
  SpecialtyUserController.getAllBySpecialty
);

router.put('/report/:id',
  authenticate,
  SpecialtyUserController.sendReport
);

router.put('/approve/user/:userId/specialty/:specialtyId',
  authenticate,
  authorize(['admin', 'director', 'counselor', 'lead']),
  SpecialtyUserController.approve
);
router.patch('/reject/user/:userId/specialty/:specialtyId',
  authenticate,
  authorize(['admin', 'director', 'counselor', 'lead']),
  SpecialtyUserController.reject
);

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  SpecialtyUserController.update
); 

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  SpecialtyUserController.delete
); 

export default router;
