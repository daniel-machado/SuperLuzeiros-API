// infrastructure/controllers/quizDetailedAttemptController.ts
import { Request, Response } from 'express';
import { createQuizDetailedAttemptUseCase } from '../../application/usecases/QuizDetailedAttempt/createQuizDetailedAttemptUseCase';
import { QuizUserDetailedAttemptRepository } from '../../infrastructure/database/repositories/QuizUserDetailedAttemptRepository';
import { QuizRepository } from '../../infrastructure/database/repositories/QuizRepository';
import { QuizQuestionRepository } from '../../infrastructure/database/repositories/QuizQuestionRepository';
import { QuizAnswerRepository } from '../../infrastructure/database/repositories/QuizAnswerRepository';
import { QuizStatisticsRepository } from '../../infrastructure/database/repositories/QuizStatisticsRepository';


  export const quizDetailedAttemptController = {

  async create(req: Request, res: Response): Promise<void>  {
    try {
      const { attemptData, userAnswers } = req.body;

      const detailedAttempt = await createQuizDetailedAttemptUseCase(
        attemptData,
        userAnswers,
        QuizUserDetailedAttemptRepository,
        QuizRepository,
        QuizQuestionRepository,
        QuizAnswerRepository,
        QuizStatisticsRepository
      );

      res.status(201).json({
        success: true,
        message: 'Tentativa detalhada criada com sucesso',
        result: detailedAttempt,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar tentativa detalhada',
        result: null,
      });
    }
  },

  async findByAttemptId(req: Request, res: Response): Promise<void>  {
    try {
      const { attemptId } = req.params;
      const detailedAttempt = await QuizUserDetailedAttemptRepository.findByAttemptId(attemptId);

      if (!detailedAttempt) {
        res.status(404).json({
          success: false,
          message: 'Tentativa detalhada não encontrada',
          result: null,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tentativa detalhada encontrada',
        result: detailedAttempt,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar tentativa detalhada',
        result: null,
      });
    }
  },

  async findByUserAndQuiz(req: Request, res: Response): Promise<void>  {
    try {
      const { userId, quizId } = req.params;
      const detailedAttempts = await QuizUserDetailedAttemptRepository.findByUserAndQuiz(userId, quizId);

      res.status(200).json({
        success: true,
        message: 'Tentativas detalhadas encontradas',
        result: detailedAttempts || [],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar tentativas detalhadas',
        result: null,
      });
    }
  },

  async findByUser(req: Request, res: Response): Promise<void>  {
    try {
      const { userId } = req.params;
      const detailedAttempts = await QuizUserDetailedAttemptRepository.findByUser(userId);

      res.status(200).json({
        success: true,
        message: 'Tentativas detalhadas do usuário encontradas',
        result: detailedAttempts || [],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar tentativas detalhadas do usuário',
        result: null,
      });
    }
  }
}
