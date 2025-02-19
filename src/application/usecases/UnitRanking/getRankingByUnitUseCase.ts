import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

export const getRankingByUnitsUseCase = async (
  unitId: string,
  rankingRepo: IUnitRankingRepository
) => {
  try {
    return await rankingRepo.findByUnit(unitId);
  } catch (error: any) {
    console.log("Error:", error )
    throw new Error("Erro ao buscar ranking")
  }
}