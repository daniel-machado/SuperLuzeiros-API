import { Request, Response } from 'express';

import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

import { IndividualEvaluationRepository } from '../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IndividualEvaluationAnswerRepository } from '../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';
import { IndividualRankingRepository } from '../../infrastructure/database/repositories/InidividualRankingRepository';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { unitRepository } from '../../infrastructure/database/repositories/UnitRepository';


//Use Case
import { listEvaluationUseCase } from '../../application/usecases/IndividualEvaluations/listEvaluationUseCase';
import { listEvaluationByIdUseCase } from '../../application/usecases/IndividualEvaluations/listEvaluationByIdUseCase';
import { listEvaluationAllByUserUseCase } from '../../application/usecases/IndividualEvaluations/listEvaluationAllByUserUseCase';
import { listEvaluationAllByUserAndWeekUseCase } from '../../application/usecases/IndividualEvaluations/listEvaluationAllByUserAndWeekUseCase';
import { listActiveEvaluationByUserUseCase } from '../../application/usecases/IndividualEvaluations/listActiveEvaluationByUserUseCase';
import { listActiveEvaluationAllUseCase } from '../../application/usecases/IndividualEvaluations/listActiveEvaluationAllUseCase';
import { createEvaluationUseCase } from '../../application/usecases/IndividualEvaluations/createEvaluationUseCase';
import { updateEvaluationUseCase } from '../../application/usecases/IndividualEvaluations/updateEvaluationUseCase';
import { deleteEvaluationUseCase } from '../../application/usecases/IndividualEvaluations/deleteEvaluationUseCase';

export const IndividualEvaluationController = {

  // Create Evaluation
  async createEvaluation(req: Request, res: Response): Promise<void>  {
    const { userId,  week } = req.body;
    try {
      const evaluation = await createEvaluationUseCase(
        { userId, week }, 
          IndividualEvaluationRepository,
          IndividualEvaluationAnswerRepository,
          IndividualRankingRepository,
          UnitEvaluationRepository,
          unitRepository,
          
      );
      res.status(201).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update evaluation unit
  async updateEvaluation(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const data = req.body;
    try {
      const updateEvaluation = await updateEvaluationUseCase(
        id, 
        data, 
        IndividualEvaluationRepository,
        IndividualEvaluationAnswerRepository,
        IndividualRankingRepository
      );
      res.status(200).json({success: true, updateEvaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete evaluation unit
  async deleteEvaluation(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteEvaluationUseCase(
        id, 
        IndividualEvaluationRepository,
        IndividualRankingRepository
      );
      res.status(204).json({success: true, message: 'Evaluation deleted'});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar Todas Evaluations
  async listEvaluations(req: Request, res: Response): Promise<void>  {
    try {
      const evaluations = await listEvaluationUseCase(IndividualEvaluationRepository);
      res.status(200).json({success: true, evaluations});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar Evaluation por ID
  async listOneEvaluationById(req: Request, res: Response): Promise<void>  {
    const { Id } = req.params;
    try {
      const evaluation = await listEvaluationByIdUseCase(Id, IndividualEvaluationRepository );
      res.status(200).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar todas Evaluations de uma unidade
  async listAllEvaluationByUser(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params;
    try {
      const evaluation = await listEvaluationAllByUserUseCase(userId, IndividualEvaluationRepository );
      res.status(200).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar todas Evaluations de uma unidade
  async listAllEvaluationByUserAndWeek(req: Request, res: Response): Promise<void>  {
    const { userId, week } = req.params;
    try {
      const evaluation = await listEvaluationAllByUserAndWeekUseCase(userId, Number(week), IndividualEvaluationRepository );
      res.status(200).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

    // Listar Todas Evaluations
    async listActiveEvaluationByUser(req: Request, res: Response): Promise<void>  {
      const { userId } = req.params;
      try {
        const evaluations = await listActiveEvaluationByUserUseCase(userId, IndividualEvaluationRepository );
        res.status(200).json({success: true, evaluations});
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
    },

    // Listar Todas Evaluations
  async listActiveUnitEvaluationAll(req: Request, res: Response): Promise<void>  {
    try {
      const evaluations = await listActiveEvaluationAllUseCase(IndividualEvaluationRepository);
      res.status(200).json({success: true, evaluations});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
}