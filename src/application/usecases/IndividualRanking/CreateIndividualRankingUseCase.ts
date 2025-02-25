import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const createIndividualRankingUseCase = async (
  userId: string, 
  week: number, 
  totalScore: number, 
  individualRankingRepository: IInidividualRankingRepository
) => {

  const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, week);
  
  if (!existingRanking) {
    const id = userId as string
    await individualRankingRepository.createRanking(
      { 
        dbvId: id, 
        week, 
        totalScore
      });
  } else {
    throw new Error('Ranking já foi criado'); 
  }
}