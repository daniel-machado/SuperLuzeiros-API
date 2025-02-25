import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";

export const listRankingIndividualByUserUseCase = async (
  userId: string,
  individualRankingRepository: IInidividualRankingRepository
) => {
  try {
    return await individualRankingRepository.findByUser(userId);
  } catch (error: any) {
    console.log("Error:", error )
    throw new Error("Erro ao buscar ranking")
  }
}