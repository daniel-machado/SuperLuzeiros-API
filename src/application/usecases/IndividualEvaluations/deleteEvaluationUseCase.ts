import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";


export const deleteEvaluationUseCase = async (
  id: string,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
  individualRankingRepository: IInidividualRankingRepository
) => {

  const existingEvaluation = await individualEvaluationRepository.getEvaluationById(id);
  if(existingEvaluation){

    const existingRanking = await individualRankingRepository.findByUserAndWeek(
      existingEvaluation.userId, 
      existingEvaluation.week
    )
    if(existingRanking){
      await individualRankingRepository.removeRanking(existingRanking.id as string);
    }
    
    await individualEvaluationRepository.deleteEvaluation(id);
    
  } 
}