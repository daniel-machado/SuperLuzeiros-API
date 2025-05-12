import express, { Router } from 'express';

import { unitController } from '../controllers/UnitController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

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
router.put('/updateUnit/:id', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.updateUnit
); 

// Deletar unidade
router.delete('/deleteUnit/:id', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.deleteUnit
); 

// Adicionar conselheiro
router.post('/:unitId/counselors', 
  authenticate,
  authorize(['admin', 'director']),
  unitController.addCounselorToUnit
);

// Verificar se o conselheiro já está na unidade
router.get('/exist-counselor-unit/:userId', 
  authenticate,
  //authorize(['admin', 'director', 'counselor']),
  unitController.existeUnitCounselor
);

// Verificar se o conselheiro já está na unidade
router.get('/exist-dbv-unit/:userId', 
  authenticate,
  //authorize(['admin', 'director', 'counselor']),
  unitController.existeUnitDbv
);
// Adicionar dbv
router.post('/:unitId/dbvs',   
  authenticate,
  authorize(['admin', 'director']),
  unitController.addDbvToUnit
); 

// Remover conselheiro de unidade
router.delete("/removecounselor/:unitId/counselor/:userId", 
  authenticate,
  authorize(['admin', 'director']),
  unitController.removeCounselorFromUnit
); 

// Remover dbv de uma unidade
router.delete("/removedbv/:unitId/dbv/:userId", 
  authenticate,
  authorize(['admin', 'director']),
  unitController.removeDbvFromUnit
); 

export default router;


