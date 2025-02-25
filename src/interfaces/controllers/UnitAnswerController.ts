import { Request, Response } from 'express';

import { UnitEvaluationQuestionRepository } from '../../infrastructure/database/repositories/UnitEvaluationQuestionRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

// Use cases
import { saveUnitAnswerUseCase } from '../../application/usecases/UnitAnswer/saveUnitAnswerUseCase';
import { listUnitAnswerUseCase } from '../../application/usecases/UnitAnswer/listUnitAnswerUseCase';
import { deleteUnitAnswerUseCase } from '../../application/usecases/UnitAnswer/deleteUnitAnswerUseCase';
import { getUnitAnswerAllUseCase } from '../../application/usecases/UnitAnswer/getUnitAnswerAllUseCase';

export const UnitAnswerController = {

  async createUnitAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { unitId, questionId, answer, week } = req.body;
      const newAnswer = await saveUnitAnswerUseCase(
        unitId, 
        questionId, 
        answer,
        week,
        UnitEvaluationQuestionRepository,
        UnitEvaluationAnswerRepository,
        UnitEvaluationRepository,
        UnitRankingRepository
      );
      res.status(201).json({
        success: true,
        message: 'Resposta enviada',
        newAnswer
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async listUnitAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { unitId } = req.params;
      const answers = await listUnitAnswerUseCase(unitId, UnitEvaluationAnswerRepository);
      res.status(200).json({
        success: true,
        message: 'List respostas',
        answers
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async listUnitAnswerAll(req: Request, res: Response): Promise<void>  {
    try {
      const answers = await getUnitAnswerAllUseCase(UnitEvaluationAnswerRepository);
      res.status(200).json({
        success: true,
        message: 'List respostas',
        answers
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUnitAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      const answers = await deleteUnitAnswerUseCase(
        id, 
        UnitEvaluationAnswerRepository,
        UnitEvaluationRepository,
        UnitRankingRepository
      );
      res.status(200).json({
        success: true,
        message: 'Deleted',
        answers
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
}