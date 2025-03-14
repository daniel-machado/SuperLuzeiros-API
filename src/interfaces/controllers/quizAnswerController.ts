import { Request, Response } from 'express';

import { QuizAnswerRepository } from '../../infrastructure/database/repositories/QuizAnswerRepository';

// Use Cases
import { createQuizAnswerUseCase } from '../../application/usecases/Quiz/QuizAnswer/createQuizAnswerUseCase';
import { deleteQuizAnswerUseCase } from '../../application/usecases/Quiz/QuizAnswer/deleteQuizAnswerUseCase';
import { getAllQuizAnswerUseCase } from '../../application/usecases/Quiz/QuizAnswer/getAllQuizAnswerUseCase';
import { getAnswerByQuestionIdUseCase } from '../../application/usecases/Quiz/QuizAnswer/getAnswerByQuestionIdUseCase';
import { getQuizAnswerByIdUseCase } from '../../application/usecases/Quiz/QuizAnswer/getQuizAnswerByIdUseCase';
import { updateQuizAnswerByIdUseCase } from '../../application/usecases/Quiz/QuizAnswer/updateQuizAnswerUseCase';

export const quizAnswerController = {

  async create(req: Request, res: Response): Promise<void>  {
    const data = req.body;
    try {
      const result = await createQuizAnswerUseCase(data, QuizAnswerRepository)
      res.status(201).json({
        success: true,
        message: 'Resposta criada',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllQuizAnswerUseCase(QuizAnswerRepository)
      res.status(201).json({
        success: true,
        message: 'Todas as respostas',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params
    try {
      const result = await getQuizAnswerByIdUseCase(id, QuizAnswerRepository)
      res.status(201).json({
        success: true,
        message: 'Resposta',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQuestionId(req: Request, res: Response): Promise<void>  {
    const { questionId } = req.params
    try {
      const result = await getAnswerByQuestionIdUseCase(questionId, QuizAnswerRepository)
      res.status(201).json({
        success: true,
        message: 'Respostas da question',
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
      const result = await updateQuizAnswerByIdUseCase(id, data, QuizAnswerRepository)
      res.status(201).json({
        success: true,
        message: 'Resposta atualizada',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteQuizAnswerUseCase(id, QuizAnswerRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
}