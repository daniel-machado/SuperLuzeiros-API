import { Request, Response } from 'express';

import { QuizStatisticsRepository } from '../../infrastructure/database/repositories/QuizStatisticsRepository';

// UseCase
import { createQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/createQuizStatisticsUseCase';
import { deleteQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/deleteQuizStatisticsUseCase';
import { getAllQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getAllQuizStatisticsUseCase';
import { getByIdQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getByIdQuizStatisticsUseCase';
import { getByQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getByQuizStatisticsUseCase';
import { updateQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/updateQuizStatisticsUseCase';
import { getAverageScoreQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getAverageScoreQuizStatisticsUseCase';
import { getByUserAndQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getByUserAndQuizStatisticsUseCase';
import { getByUserQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getByUserQuizStatisticsUseCase';
import { getPassRateQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getPassRateQuizStatisticsUseCase';
import { getTotalAttemptQuizStatisticsUseCase } from '../../application/usecases/Quiz/QuizStatistics/getTotalAttempsQuizStatisticsUseCase';


export const quizStatisticsController = {

  // async create(req: Request, res: Response): Promise<void>  {
  //   const data = req.body;
  //   try {
  //     const result = await createQuizStatisticsUseCase(data, QuizStatisticsRepository)
  //     res.status(201).json({
  //       success: true,
  //       message: 'Estatística criada',
  //       result
  //   });
  //   } catch (error: any) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const data = req.body;
    try {
      const result = await updateQuizStatisticsUseCase(id, data, QuizStatisticsRepository);
      res.status(201).json({
        success: true,
        message: 'Estatística Atualizada',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteQuizStatisticsUseCase(id, QuizStatisticsRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllQuizStatisticsUseCase(QuizStatisticsRepository);
      res.status(201).json({
        success: true,
        message: 'Todas as estatísticas',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const result = await getByIdQuizStatisticsUseCase(id, QuizStatisticsRepository);
      res.status(201).json({
        success: true,
        message: 'Estatística do ID',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByQuiz(req: Request, res: Response): Promise<void>  {
    const { quizId } = req.params;
    try {
      const result = await getByQuizStatisticsUseCase(quizId, QuizStatisticsRepository);
      res.status(201).json({
        success: true,
        message: 'Estatística de um Quiz',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUserAndQuiz(req: Request, res: Response): Promise<void>  {
    const { userId, quizId } = req.params;
    try {
      const result = await getByUserAndQuizStatisticsUseCase(userId, quizId, QuizStatisticsRepository);
      res.status(201).json({
        success: true,
        message: 'Estatísticas de Usuário e quiz específico',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUser(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params;
    try {
      const result = await getByUserQuizStatisticsUseCase(userId, QuizStatisticsRepository)
      res.status(201).json({
        success: true,
        message: 'Estatística de um user',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAverageScore(req: Request, res: Response): Promise<void> {
    const { quizId, userId } = req.query;
    try {
      const result = await getAverageScoreQuizStatisticsUseCase(QuizStatisticsRepository, quizId as string, userId as string);
      res.status(201).json({
        success: true,
        message: 'Média de pontuação dos quizzes',
        result,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getPassRate(req: Request, res: Response): Promise<void> {
    const { quizId, userId } = req.query; 
    try {
      const result = await getPassRateQuizStatisticsUseCase(QuizStatisticsRepository, quizId as string, userId as string);
      res.status(201).json({
        success: true,
        message: 'Taxa Média de aprovação',
        result,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getTotalAttempt(req: Request, res: Response): Promise<void> {
    const { quizId } = req.params;         
    const { userId } = req.query;
    try {
      const result = await getTotalAttemptQuizStatisticsUseCase(QuizStatisticsRepository, quizId as string, userId as string);
      res.status(201).json({
        success: true,
        message: 'Soma do total de tentativas',
        result,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}