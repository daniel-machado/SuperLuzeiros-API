import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const listRankingIndividualUseCasetsts = async (
  individualRankingRepository: IInidividualRankingRepository
) => {
  return await individualRankingRepository.getRanking();
}