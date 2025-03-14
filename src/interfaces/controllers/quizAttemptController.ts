import { Request, Response } from 'express';

import { QuizUserAttemptRepository } from '../../infrastructure/database/repositories/QuizUserAttemptRepository';
import { QuizAnswerRepository } from '../../infrastructure/database/repositories/QuizAnswerRepository';
import { UserSpecialtyRepository } from '../../infrastructure/database/repositories/UserSpecialtyRepository';
import { QuizRepository } from '../../infrastructure/database/repositories/QuizRepository';

// Use Cases
import { createQuizAttemptUseCase } from '../../application/usecases/Quiz/QuizAttempt/createQuizAttemptUseCase';
import { deleteQuizAttemptsUseCase } from '../../application/usecases/Quiz/QuizAttempt/deleteQuizAttemptUseCase';
import { getAllQuizAttemptsUseCase } from '../../application/usecases/Quiz/QuizAttempt//getAllQuizAttemptsUseCase';
import { getUserAttemptsUseCase } from '../../application/usecases/Quiz/QuizAttempt/getUserAttemptsUseCase';
import { getByIdAttemptUseCase } from '../../application/usecases/Quiz/QuizAttempt/getByIdAttemptUseCase';
import { updateQuizAttemptsUseCase } from '../../application/usecases/Quiz/QuizAttempt/updateQuizAttemptUseCase';


export const quizAttemptController = {

  async create(req: Request, res: Response): Promise<void>  {
    const { userId, quizId, answers } = req.body;
    try {
      const result = await createQuizAttemptUseCase(
        {userId, quizId}, 
        answers, 
        QuizUserAttemptRepository,
        QuizAnswerRepository,
        UserSpecialtyRepository,
        QuizRepository
      )
      res.status(201).json({
        success: true,
        message: 'Quiz enviado com sucesso!',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllQuizAttemptsUseCase(QuizUserAttemptRepository)
      res.status(201).json({
        success: true,
        message: 'Todas as tentativas',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

    async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const result = await getByIdAttemptUseCase(id, QuizUserAttemptRepository);
      res.status(201).json({
        success: true,
        message: 'Tentativa por ID',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserAttempts(req: Request, res: Response): Promise<void>  {
    const { userId, quizId } = req.params;
    try {
      const result = await getUserAttemptsUseCase(userId, quizId, QuizUserAttemptRepository);
      res.status(201).json({
        success: true,
        message: 'Todas as tentativas do Usuário',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const data = req.body;
    try {
      const result = await updateQuizAttemptsUseCase(id, data, QuizUserAttemptRepository)
      res.status(201).json({
        success: true,
        message: 'Tentativa Atualizada',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteQuizAttemptsUseCase(id, QuizUserAttemptRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
}