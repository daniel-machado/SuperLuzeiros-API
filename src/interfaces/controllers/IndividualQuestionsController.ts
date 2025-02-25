import { Request, Response } from 'express';

import { IndividualEvaluationQuestionRepository } from '../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';

// Use cases
import { createQuestionUseCase } from '../../application/usecases/IndividualQuestions/createQuestionUseCase';
import { getQuestionsUseCase } from '../../application/usecases/IndividualQuestions/getQuestionsUseCase';
import { updateQuestionUseCase } from '../../application/usecases/IndividualQuestions/updateQuestionsUseCase';
import { deleteQuestionUseCase } from '../../application/usecases/IndividualQuestions/deleteQuestionUseCase';

export const IndividualQuestionsController = {

  async createQuestion(req: Request, res: Response): Promise<void>  {
      try {
        const { question, points } = req.body;
        const newQuestion = await createQuestionUseCase(question, points, IndividualEvaluationQuestionRepository);
        res.status(201).json(newQuestion);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  },

  async listQuestion(req: Request, res: Response): Promise<void>  {
      try {
        const questions = await getQuestionsUseCase(IndividualEvaluationQuestionRepository);
        res.status(200).json(questions);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  },

  async updateQuestion(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedQuestion = await updateQuestionUseCase(id, data, IndividualEvaluationQuestionRepository);
      res.status(200).json(updatedQuestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteQuestion(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      await deleteQuestionUseCase(id, IndividualEvaluationQuestionRepository);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
}