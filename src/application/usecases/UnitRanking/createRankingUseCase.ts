import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const createRankingUseCase = async (
  unitId: string,
  week: number,
  correctAnswers: number,
  wrongAnswers: number,
  score: number,
  rankingRepo: IUnitRankingRepository
) => {

  const existingRanking = await rankingRepo.findByUnitAndWeek(unitId as string, week);
  
  if (!existingRanking) {
    const id = unitId as string
    await rankingRepo.createRanking({ unitId: id, week, correctAnswers, wrongAnswers, totalScore: score });
  } else {
    throw new Error('Ranking já foi criado'); 
  }
}