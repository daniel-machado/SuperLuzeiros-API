import { Request, Response } from 'express';


import { DailyVerseReadingRepository } from '../../infrastructure/database/repositories/DailyVerseRepository'



// Use Cases
import { registerDailyReadingUseCase } from '../../application/usecases/ReadingVerse/registerDailyReadingUseCase';
import { getUserStreakInfoUseCase } from '../../application/usecases/ReadingVerse/getUserStreakInfoUseCase';
import { getUserReadingHistoryUseCase } from '../../application/usecases/ReadingVerse/getUserReadingHistoryUseCase';


export const dailyReadingController = {
  /**
   * Registra uma leitura diária e atualiza o streak do usuário
   */
  async registerReading(req: Request, res: Response): Promise<void> {
    const {
      userId,
      book,
      chapter,
      verse,
      pointsEarned = 10
    } = req.body;


    if (!userId || !book || !chapter || !verse) {
      res.status(400).json({
        error: "Campos obrigatórios faltando",
        requiredFields: ['userId', 'book', 'chapter', 'verse'],
        received: Object.keys(req.body)
      });
      return;
    }
 
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
     
      const readingData = {
        userId,
        book,
        chapter,
        verse,
        pointsEarned,
        date: today,
        readAt: new Date(),
        life: 0,
        streak: 0
      };


      const result = await registerDailyReadingUseCase(readingData, DailyVerseReadingRepository);


      res.status(201).json({
        success: true,
        message: 'Leitura registrada com sucesso',
        data: result
      });
    } catch (error: any) {
      if (error.name === 'ReadingExistsError') {
        res.status(400).json({
          success: false,
          error: error.message,
          streakInfo: error.streakInfo,
          existingReadingId: error.existingReadingId
        });
      } else {
        console.error('Erro no registro da leitura:', error);
        res.status(500).json({
          success: false,
          error: 'Erro interno no servidor',
          details: error.message
        });
      }  
    }
  },

  /**
   * Obtém as informações do streak atual do usuário
   */
  async getUserStreakInfo(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
   
    if (!userId) {
      res.status(400).json({
        error: "O parâmetro 'userId' é obrigatório"
      });
      return;
    }


    try {
      const streakInfo = await getUserStreakInfoUseCase(userId, DailyVerseReadingRepository);
     
      res.status(200).json({
        success: true,
        streakInfo
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },


  async getAllReadingsWithUsers(req: Request, res: Response): Promise<void> {
    try {
      const readings = await DailyVerseReadingRepository.findByUserId(req.params.userId);
      
      res.status(200).json({
        success: true,
        data: readings || []
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Obtém o histórico de leituras do usuário
   */
  async getReadingHistory(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;


    if (!userId) {
      res.status(400).json({ 
        error: "O parâmetro 'userId' é obrigatório" 
      });
      return;
    }


    try {
      const result = await getUserReadingHistoryUseCase(userId, DailyVerseReadingRepository);
      
      res.status(200).json({
        success: true,
        message: 'Histórico de leituras obtido com sucesso',
        result
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};
