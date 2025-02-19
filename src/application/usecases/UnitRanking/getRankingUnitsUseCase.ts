import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const getRankingUnitsUseCase = async (
  unitRankingRepository: IUnitRankingRepository
) => {
  console.log("Executando getRankingUnitsUseCase...");
  return await unitRankingRepository.getRanking();
}