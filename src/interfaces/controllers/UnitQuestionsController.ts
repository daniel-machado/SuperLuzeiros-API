import { Request, Response } from 'express';

import { UnitEvaluationQuestionRepository } from '../../infrastructure/database/repositories/UnitEvaluationQuestionRepository';

// Use cases
import { createUnitQuestionsUseCase } from '../../application/usecases/UnitQuestions/createUnitQuestionsUseCase';
import { listUnitQuestionsUseCase } from '../../application/usecases/UnitQuestions/listUnitQuestionsUseCase';
import { updateUnitQuestionsUseCase } from '../../application/usecases/UnitQuestions/updateUnitQuestionsUseCase';
import { deleteUnitQuestionsUseCase } from '../../application/usecases/UnitQuestions/deleteUnitQuestionsUseCase';

export const UnitQuestionsController = {

  async createUnitQuestion(req: Request, res: Response): Promise<void>  {
      try {
        const { question, points, typeQuestion, description } = req.body;
        const newQuestion = await createUnitQuestionsUseCase(question, points, typeQuestion, UnitEvaluationQuestionRepository, description,);
        res.status(201).json(newQuestion);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  },

  async listUnitQuestion(req: Request, res: Response): Promise<void>  {
      try {
        const questions = await listUnitQuestionsUseCase(UnitEvaluationQuestionRepository);
        res.status(200).json(questions);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  },

  async updateUnitQuestion(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedQuestion = await updateUnitQuestionsUseCase(id, data, UnitEvaluationQuestionRepository);
      res.status(200).json(updatedQuestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUnitQuestion(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      await deleteUnitQuestionsUseCase(id, UnitEvaluationQuestionRepository);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
}