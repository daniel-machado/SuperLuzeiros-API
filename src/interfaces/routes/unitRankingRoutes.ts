import express, { Router } from 'express';

import { UnitRankingController } from '../controllers/UnitRankingController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Lista todo o ranking
router.get('/list-ranking', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitRankingController.getRankingUnits
); 

// Ranking por unidade
router.get('/unit/:unitId', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitRankingController.getUnitRankingByUnit
); 

// Deletar um ranking
router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  UnitRankingController.deleteRanking
); 

// Ranking por semana
router.get('/:week', 
  authenticate,
  //authorize(['admin', 'director']),
  UnitRankingController.getUnitRankingWeek
); 







export default router;


