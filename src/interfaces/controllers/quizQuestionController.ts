import { Request, Response } from 'express';

import { QuizQuestionRepository } from '../../infrastructure/database/repositories/QuizQuestionRepository';

// Use Case
import { createQuizQuestionUseCase } from '../../application/usecases/Quiz/QuizQuestions/createQuizQuestionUseCase';
import { getAllQuizQuestionUseCase } from '../../application/usecases/Quiz/QuizQuestions/getAllQuizQuestionsUseCase';
import { getAllByQuizQuestionsUseCase } from '../../application/usecases/Quiz/QuizQuestions/getAllByQuizQuestionsUseCase';
import { getByIdQuizQuestionUseCase } from '../../application/usecases/Quiz/QuizQuestions/getByIdQuizQuestionUseCase';
import { getRandomQuizQuestionsUseCase } from '../../application/usecases/Quiz/QuizQuestions/getRandomQuizQuestionsUseCase';
import { updateQuizQuestionUseCase } from '../../application/usecases/Quiz/QuizQuestions/updateQuizQuestionUseCase';
import { deleteQuizQuestionUseCase } from '../../application/usecases/Quiz/QuizQuestions/deleteQuizQuestionUseCase'

export const quizQuestionController = {

  async create(req: Request, res: Response): Promise<void>  {
    const { quizId, question } = req.body;
    try {
      const result = await createQuizQuestionUseCase({ quizId, question }, QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Pergunta criada',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllQuizQuestionUseCase(QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Todas as perguntas',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params
    try {
      const result = await getByIdQuizQuestionUseCase(id, QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Pergunta por ID',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllByQuizId(req: Request, res: Response): Promise<void>  {
    const { quizId } = req.params
    try {
      const result = await getAllByQuizQuestionsUseCase(quizId, QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Todas as perguntas de um Quiz específico',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRandom(req: Request, res: Response): Promise<void>  {
    const { quizId } = req.params
    const { limit } = req.query;
    try {
      const questions = await getRandomQuizQuestionsUseCase(quizId, Number(limit) || 10, QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Perguntas para o Quiz',
        questions
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },


  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { quizId, question } = req.body;
    try {
      const updateQuestion = await updateQuizQuestionUseCase(id, {quizId, question}, QuizQuestionRepository)
      res.status(201).json({
        success: true,
        message: 'Pergunta Atualizada',
        updateQuestion
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteQuizQuestionUseCase(id, QuizQuestionRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
}