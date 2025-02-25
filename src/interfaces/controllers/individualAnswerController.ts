import { Request, Response } from 'express';

import { UnitEvaluationQuestionRepository } from '../../infrastructure/database/repositories/UnitEvaluationQuestionRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

import { IndividualEvaluationAnswerRepository } from '../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository'
import { IndividualEvaluationQuestionRepository } from '../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';
import { IndividualEvaluationRepository } from '../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IndividualRankingRepository } from '../../infrastructure/database/repositories/InidividualRankingRepository';
import { unitRepository } from '../../infrastructure/database/repositories/UnitRepository';

// Use cases
import { listAnswerUseCase } from '../../application/usecases/IndividualAnswer/getAnswerUseCase';
import { deleteAnswerUseCase } from '../../application/usecases/IndividualAnswer/deleteAnswerUseCase';
import { createAnswerUseCase } from '../../application/usecases/IndividualAnswer/createAnswerUseCase';
import { getAllAnswerUseCase } from '../../application/usecases/IndividualAnswer/getAllAnswerUseCase';

export const IndividualAnswerController = {

  async createAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { userId, questionId, answer, week } = req.body;
      const newAnswer = await createAnswerUseCase(
        userId, 
        questionId, 
        answer,
        week,
        IndividualEvaluationAnswerRepository,
        IndividualEvaluationQuestionRepository,
        IndividualEvaluationRepository,
        IndividualRankingRepository,
        
        unitRepository,

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

  async listAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { dbvId } = req.params;
      const answers = await listAnswerUseCase(dbvId, IndividualEvaluationAnswerRepository);
      res.status(200).json({
        success: true,
        message: 'List respostas',
        answers
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async listAllAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const answers = await getAllAnswerUseCase(IndividualEvaluationAnswerRepository);
      res.status(200).json({
        success: true,
        message: 'List respostas',
        answers
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteAnswer(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      await deleteAnswerUseCase(
        id, 
        IndividualEvaluationAnswerRepository,
        IndividualEvaluationRepository,
        IndividualRankingRepository,
        unitRepository,

        UnitEvaluationRepository,
        UnitRankingRepository
      );
      res.status(200).json({
        success: true,
        message: 'Deleted',
    });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
}