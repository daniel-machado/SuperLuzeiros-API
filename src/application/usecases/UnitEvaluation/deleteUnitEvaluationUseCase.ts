import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const deleteUnitEvaluationUseCase = async (
  id: string,
  unitEvaluationRepository: IUnitEvaluationRepository, 
  unitRankingRepository: IUnitRankingRepository
) => {

  const existingEvaluation = await unitEvaluationRepository.getUnitEvaluationById(id);
  if(existingEvaluation){

    const existingRanking = await unitRankingRepository.findByUnitAndWeek(
      existingEvaluation.unitId, 
      existingEvaluation.week
    )
    if(existingRanking){
      await unitRankingRepository.removeRanking(existingRanking.id as string);
    }
    
    await unitEvaluationRepository.deleteUnitEvaluation(id);
    
  } 
}