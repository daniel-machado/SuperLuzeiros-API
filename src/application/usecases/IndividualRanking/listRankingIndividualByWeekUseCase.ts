import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const listRankingIndividualByWeekUseCase = async (
  week: number,
  individualRankingRepository: IInidividualRankingRepository
) => {

  return await individualRankingRepository.getRankingByWeek(week);

}