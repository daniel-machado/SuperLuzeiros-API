import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const updateIndividualRankingUseCase = async (
  userId: string,
  week: number,
  score: number,
  individualRankingRepository: IInidividualRankingRepository
) => {

  const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, week);
  
  if (existingRanking) {
    existingRanking.totalScore = score;
    await individualRankingRepository.updateRanking(existingRanking);
  } else {
    throw new Error('Precisa criar um ranking')
  }
}