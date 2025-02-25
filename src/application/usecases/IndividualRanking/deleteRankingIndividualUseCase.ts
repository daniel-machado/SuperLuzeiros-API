import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const deleteRankingIndividualUseCase = async (
  id: string,
  individualRankingRepository: IInidividualRankingRepository, 
) => {

  return await individualRankingRepository.removeRanking(id);

}