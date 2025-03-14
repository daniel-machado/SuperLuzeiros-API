import express, { Router } from 'express';

import { quizStatisticsController } from '../../interfaces/controllers/quizStatisticsController';

import { authenticate } from '../../interfaces/middlewares/authMiddleware';
import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';

const router: Router = express.Router();

// 🟢 Rotas para criação, atualização e deleção
// router.post('/create', 
//   authenticate,
//   authorize(['admin', 'director']),
//   quizStatisticsController.create
// );

router.put('/update/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizStatisticsController.update
);

router.delete('/delete/:id', 
  authenticate,
  authorize(['admin', 'director']),
  quizStatisticsController.delete
);

// 🟠 Rotas para listar estatísticas
router.get('/list-all', 
  authenticate,
  authorize(['admin', 'director']),
  quizStatisticsController.getAll
);

router.get('/by-id/:id', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getById
);

router.get('/by-quiz/:quizId', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getByQuiz
);

router.get('/by-user-and-quiz/:userId/:quizId', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getByUserAndQuiz
);

router.get('/by-user/:userId', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getByUser
);

// 🟡 Rotas para estatísticas avançadas
router.get('/average-score', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getAverageScore
);

router.get('/pass-rate', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getPassRate
);

router.get('/total-attempt/:quizId', 
  authenticate,
  authorize(['admin', 'director', 'counselor', 'dbv']),
  quizStatisticsController.getTotalAttempt
);

export default router;
