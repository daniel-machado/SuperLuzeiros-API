import express, { Router } from 'express';

import { unitController } from '../controllers/UnitController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Rotas de Unit

// Criar Unidade
router.post('/createUnit', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.createUnit
); 

// Listar todas as unidades
router.get('/getunits', 
  authenticate,
  unitController.getAllUnits
); 
  
// Buscar unidade por ID
router.get('/getunit/:id', 
  authenticate,
  unitController.getUnitById
); 

// Atualizar unidade
router.put('/updateunit/:id', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.updateUnit
); 

// Deletar unidade
router.delete('/deleteunit/:id', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.deleteUnit
); 

// Adicionar conselheiro
router.post('/counselorinunit:id/counselors', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.addCounselorToUnit
);

// Adicionar dbv
router.post('/dbvinunit:id/dbvs',   
  authenticate,
  authorize(['admin', 'director']),
  unitController.addDbvToUnit
); 

// Remover conselheiro
router.delete('/removeconselor:id/counselors/:userId', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.removeCounselorFromUnit
); 

// Remover dbv
router.delete('/removedbv:id/dbvs/:userId', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.removeDbvFromUnit
); 

export default router;


