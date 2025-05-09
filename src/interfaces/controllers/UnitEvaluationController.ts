import { Request, Response } from 'express';

import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

// Use cases
import { createUnitEvaluationUseCase } from '../../application/usecases/UnitEvaluation/createUnitEvaluationUseCase';
import { listUnitEvaluationUseCase } from '../../application/usecases/UnitEvaluation/listUnitEvaluationUseCase';
import { getUniEvaluationUseCase } from '../../application/usecases/UnitEvaluation/getUniEvaluationUseCase';
import { getUnitEvaluationAll } from '../../application/usecases/UnitEvaluation/getUnitEvaluationAll';
import { updateUnitEvaluationUseCase } from '../../application/usecases/UnitEvaluation/updateUnitEvaluationUseCase';
import { deleteUnitEvaluationUseCase } from '../../application/usecases/UnitEvaluation/deleteUnitEvaluationUseCase';
import { calculateUnitScoreUseCase } from '../../application/usecases/UnitEvaluation/calculateUnitScoreUseCase';
import { listActiveEvaluationByIdUseCase } from '../../application/usecases/UnitEvaluation/listActiveEvaluationByIdUseCase';
import { listActiveUnitEvaluationAllUseCase } from '../../application/usecases/UnitEvaluation/listActiveUnitEvaluationAllUseCase';

export const UnitEvaluationController = {

  // Create Evaluation
  async createUnitEvaluation(req: Request, res: Response): Promise<void>  {
    const { unitId, evaluatedBy, correctAnswers, wrongAnswers, examScore,  week } = req.body;
    try {
      const evaluation = await createUnitEvaluationUseCase(
        {
          unitId,
          evaluatedBy,
          correctAnswers, 
          wrongAnswers,
          examScore,
          week,
        }, 
        UnitEvaluationRepository,
        UnitEvaluationAnswerRepository,
        UnitRankingRepository
      );
      res.status(201).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update evaluation unit
  async updateUnitEvaluation(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const data = req.body;
    try {
      const updateEvaluation = await updateUnitEvaluationUseCase(
        id, 
        data, 
        UnitEvaluationRepository, 
        UnitEvaluationAnswerRepository,
        UnitRankingRepository
      );
      res.status(200).json({success: true, updateEvaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete evaluation unit
  async deleteUnitEvaluation(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteUnitEvaluationUseCase(id, UnitEvaluationRepository, UnitRankingRepository );
      res.status(204).json({success: true, message: 'Evaluation deleted'});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar Todas Evaluations
  async listUnitEvaluation(req: Request, res: Response): Promise<void>  {
    try {
      const evaluations = await listUnitEvaluationUseCase(UnitEvaluationRepository );
      res.status(200).json({success: true, evaluations});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

    // Listar Todas Evaluations aberta de uma unidade
    async listActiveEvaluationByUnitId(req: Request, res: Response): Promise<void>  {
      const { unitId } = req.params;
      try {
        const evaluations = await listActiveEvaluationByIdUseCase(unitId, UnitEvaluationRepository );
        res.status(200).json({success: true, evaluations});
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
    },

      // Listar Todas Evaluations Abertas
  async listActiveUnitEvaluationAll(req: Request, res: Response): Promise<void>  {
    try {
      const evaluations = await listActiveUnitEvaluationAllUseCase(UnitEvaluationRepository );
      res.status(200).json({success: true, evaluations});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar Evaluation por ID
  async listUnitEvaluationGetById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const evaluation = await getUniEvaluationUseCase(id, UnitEvaluationRepository );
      res.status(200).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Listar todas Evaluations de uma unidade
  async listUnitEvaluationFromUnit(req: Request, res: Response): Promise<void>  {
    const { unitId } = req.params;
    try {
      const evaluation = await getUnitEvaluationAll(unitId, UnitEvaluationRepository );
      res.status(200).json({success: true, evaluation});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async calculateUnitEvaluation(req: Request, res: Response): Promise<void>  {
    try {
      const { unitId, examScore } = req.body;
      const finalScore = await calculateUnitScoreUseCase(unitId, examScore, UnitEvaluationAnswerRepository);
      res.status(200).json({success: true, finalScore });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }, 
}