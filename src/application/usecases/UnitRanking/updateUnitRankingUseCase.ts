import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const updateUnitRankingUseCase = async (
  unitId: string,
  week: number,
  correctAnswers: number,
  wrongAnswers: number,
  score: number,
  rankingRepo: IUnitRankingRepository
) => {

  const existingRanking = await rankingRepo.findByUnitAndWeek(unitId as string, week);
  
  if (existingRanking) {
    existingRanking.totalScore = score;
    existingRanking.correctAnswers = correctAnswers;
    existingRanking.wrongAnswers = wrongAnswers;
    await rankingRepo.updateRanking(existingRanking);
  } else {
    throw new Error('Precisa criar um ranking')
  }
}