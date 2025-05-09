import { Request, Response } from 'express';

import { QuizRepository } from '../../infrastructure/database/repositories/QuizRepository';

// UseCase
import { createQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/createQuizUseCase';
import { updateQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/updateQuizUseCase';
import { deleteQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/deleteQuizUseCase';
import { getAllQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/getAllQuizUseCase';
import { getQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/getQuizUseCase';
import { getBySpecialtyQuizUserUseCase } from '../../application/usecases/Quiz/Quiz/getBySpecialtyQuizUseCase';


export const quizController = {

  async create(req: Request, res: Response): Promise<void>  {
    const { title, specialtyId } = req.body;
    try {
      const result = await createQuizUserUseCase({title, specialtyId, is_active: false }, QuizRepository);
      res.status(201).json({
        success: true,
        message: 'Created Quiz',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { title, specialtyId, is_active } = req.body;
    try {
      const result = await updateQuizUserUseCase(id, {title, specialtyId, is_active}, QuizRepository)
      res.status(201).json({
        success: true,
        message: 'Updated Quiz',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteQuizUserUseCase(id, QuizRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllQuiz(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllQuizUserUseCase(QuizRepository)
      res.status(201).json({
        success: true,
        message: 'Quizzes',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQuiz(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const result = await getQuizUserUseCase(id, QuizRepository)
      res.status(201).json({
        success: true,
        message: 'Quiz',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getBySpecialty(req: Request, res: Response): Promise<void>  {
    const { specialtyId } = req.params;
    try {
      const result = await getBySpecialtyQuizUserUseCase(specialtyId, QuizRepository)
      res.status(201).json({
        success: true,
        message: 'Quizzes',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
}