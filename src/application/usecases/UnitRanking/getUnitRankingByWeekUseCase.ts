import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const getUnitRankingByWeekUseCase = async (
  week: number,
  unitRankingRepository: IUnitRankingRepository
) => {

  return await unitRankingRepository.getRankingByWeek(week);

}