import { Request, Response } from 'express';

import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

// Use cases
import { getRankingUnitsUseCase } from '../../application/usecases/UnitRanking/getRankingUnitsUseCase';
import { getUnitRankingByWeekUseCase } from '../../application/usecases/UnitRanking/getUnitRankingByWeekUseCase';
import { deleteRankingUseCase } from '../../application/usecases/UnitRanking/deleteRankingUseCase';
import { getRankingByUnitsUseCase } from '../../application/usecases/UnitRanking/getRankingByUnitUseCase';

export const UnitRankingController = {

  async getUnitRankingWeek(req: Request, res: Response): Promise<void>  {
    const { week } = req.params;
    try {
      if (!week) {
        res.status(400).json({ error: "Week is required" });
      }
      const ranking = await getUnitRankingByWeekUseCase(Number(week), UnitRankingRepository);
      res.status(201).json({success: true, ranking});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getUnitRankingByUnit(req: Request, res: Response): Promise<void>  {
    const { unitId } = req.params;
    try {
      if (!unitId) {
        res.status(400).json({ error: "unitId is required" });
      }
      const ranking = await getRankingByUnitsUseCase(unitId, UnitRankingRepository);
      res.status(201).json({success: true, ranking});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getRankingUnits(req: Request, res: Response): Promise<void>  {
    try {
      console.log("Chamando getRankingUnitsUseCase...");
      const ranking = await getRankingUnitsUseCase(UnitRankingRepository);
      console.log("Resultado do UseCase:", ranking);

      res.status(200).json({success: true, ranking});

    } catch (error) {
      console.log("Error capturado no Controller:", error);
      res.status(400).json({ success: false, error: error });
    }
  },

  // Delete Ranking unit
  async deleteRanking(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteRankingUseCase(id, UnitRankingRepository );
      res.status(204).json({success: true, message: 'Ranking deleted'});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
  
}