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
      userId,  // ID do usuário (deve vir do token de autenticação em produção)
      book,    // Livro bíblico
      chapter, // Capítulo
      verse,   // Versículo
      pointsEarned = 10 // Pontos ganhos pela leitura (opcional, valor padrão: 10)
    } = req.body;


    // Validar campos obrigatórios
    if (!userId || !book || !chapter || !verse) {
      res.status(400).json({
        error: "Os campos 'userId', 'book', 'chapter' e 'verse' são obrigatórios"
      });
      return;
    }
 
    try {
      // Cria uma data para hoje às 00:00:00 no fuso horário local
      const today = new Date();
      today.setHours(0,0,0,0);
     
      // Preparar os dados para registro
      const readingData = {
        userId,
        book,
        chapter,
        verse,
        pointsEarned,
        date: today, //Normaliza para o início do dia atual - Data atual sem hora/minuto/segundo
        readAt: new Date(), // Data e hora atual completa
        life: 0, // Será calculado no useCase
        streak: 0 // Será calculado no useCase
      };

      // Registrar a leitura e obter informações atualizadas do streak
      const result = await registerDailyReadingUseCase(readingData, DailyVerseReadingRepository);

      res.status(201).json({
        success: true,
        message: 'Leitura registrada com sucesso',
        result
      });
    } catch (error: any) {
      // Se for um erro conhecido (já tem registro para hoje)
      if (error.message === 'Já existe um registro de leitura para esta data.') {
        // Obter informações atuais do streak para retornar mesmo com erro
        try {
          const streakInfo = await getUserStreakInfoUseCase(req.body.userId, DailyVerseReadingRepository);
          
          res.status(400).json({
            success: false,
            error: error.message,
            streakInfo // Retorna as informações atuais do streak
          });
        } catch (infoError) {
          res.status(400).json({
            success: false,
            error: error.message
          });
        }
      } else {
        // Erro interno do servidor
        res.status(500).json({
          success: false,
          error: error.message
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
    console.log("use", userId)
    try {
      const streakInfo = await getUserStreakInfoUseCase(userId, DailyVerseReadingRepository);
      console.log("Aq", streakInfo)
      
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
