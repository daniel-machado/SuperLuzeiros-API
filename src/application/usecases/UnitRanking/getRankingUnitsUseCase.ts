import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const getRankingUnitsUseCase = async (
  unitRankingRepository: IUnitRankingRepository
) => {
  return await unitRankingRepository.getRanking();
}