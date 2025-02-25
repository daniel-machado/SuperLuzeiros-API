import { Request, Response } from 'express';

import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { UnitEvaluationAnswerRepository } from '../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

import { IndividualRankingRepository } from '../../infrastructure/database/repositories/InidividualRankingRepository';

// Use cases
import { listRankingIndividualUseCasetsts } from '../../application/usecases/IndividualRanking/listRankingIndividualUseCase';
import { listRankingIndividualByUserUseCase } from '../../application/usecases/IndividualRanking/listRankingIndividualByUserUseCase';
import { listRankingIndividualByWeekUseCase } from '../../application/usecases/IndividualRanking/listRankingIndividualByWeekUseCase';
import { deleteRankingIndividualUseCase } from '../../application/usecases/IndividualRanking/deleteRankingIndividualUseCase';


export const IndividualRankingController = {

  async getRanking(req: Request, res: Response): Promise<void>  {
    try {
      const ranking = await listRankingIndividualUseCasetsts(IndividualRankingRepository);
      res.status(200).json({success: true, ranking});
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  async getRankingByUser(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params;
    try {
      if (!userId) {
        res.status(400).json({ error: "userId is required" });
      }
      const ranking = await listRankingIndividualByUserUseCase(userId, IndividualRankingRepository);
      res.status(201).json({success: true, ranking});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getRankingWeek(req: Request, res: Response): Promise<void>  {
    const { week } = req.params;
    try {
      if (!week) {
        res.status(400).json({ error: "Week is required" });
      }
      const ranking = await listRankingIndividualByWeekUseCase(Number(week), IndividualRankingRepository);
      res.status(201).json({success: true, ranking});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete Ranking unit
  async deleteRanking(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteRankingIndividualUseCase(id, IndividualRankingRepository );
      res.status(204).json({success: true, message: 'Ranking deleted'});
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
  
}