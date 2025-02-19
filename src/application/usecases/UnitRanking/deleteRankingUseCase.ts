import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const deleteRankingUseCase = async (
  id: string,
  unitRankingRepository: IUnitRankingRepository, 
) => {

  return await unitRankingRepository.removeRanking(id);

}