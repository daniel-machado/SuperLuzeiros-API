

import express, { Router } from 'express';


import { dailyReadingController } from '../../interfaces/controllers/dailyVerseController';


import { authenticate } from '../../interfaces/middlewares/authMiddleware';


const router: Router = express.Router();


// Rota para registrar uma leitura diária
router.post('/register', 
  authenticate,
  dailyReadingController.registerReading
); 


// Rota para obter informações do streak atual do usuário
router.get('/streak/:userId', 
  authenticate,
  dailyReadingController.getUserStreakInfo
); 


// Rota para obter o histórico de leituras do usuário
router.get('/history/:userId', 
  authenticate,
  dailyReadingController.getReadingHistory
); 


export default router;
















// import express, { Router } from 'express';



// import { authenticate } from '../../interfaces/middlewares/authMiddleware';
// import { authorize } from '../../interfaces/middlewares/AuthorizeMiddleware';
// import { DailyVerseController } from '../../interfaces/controllers/dailyVerseController';

// const router: Router = express.Router();

// const verseController = new DailyVerseController();

// router.post('/verse/read', 
//   //authenticate,
//   //authorize(['admin', 'director']),
//   verseController.registerRead.bind(verseController)
// ); 

// router.get('/verses/status/:userId', 
//   verseController.verifyStatusRead.bind(verseController)
// );

// router.get('/verses/history/:userId', 
//   verseController.versesAllUser.bind(verseController)
// );

// router.get('/verses/count/:userId', 
//   verseController.versesCount.bind(verseController)
// );

// export default router;
