import express, { Router } from 'express';

import { IndividualRankingController } from '../controllers/IndividualRankingController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// Lista todo o ranking
router.get('/list-ranking', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualRankingController.getRanking
); 

// Ranking por usuário
router.get('/ranking-user/:userId', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualRankingController.getRankingByUser
); 

// Ranking por semana
router.get('/list-ranking-week/:week', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualRankingController.getRankingWeek
); 

// Deletar um ranking
router.delete('/delete-ranking/:id', 
  authenticate,
  authorize(['admin', 'director']),
  IndividualRankingController.deleteRanking
); 









export default router;


