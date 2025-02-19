import { IUnitEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';

export const deleteUnitAnswerUseCase = async (
  id: string,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository
) => {
  // const existingEvaluation = await unitEvaluationRepository.getUnitEvaluationById(id);
  // if(existingEvaluation){

  //   const existingRanking = await unitRankingRepository.findByUnitAndWeek(
  //     existingEvaluation.unitId, 
  //     existingEvaluation.week
  //   )
  //   if(existingRanking){
  //     await unitRankingRepository.removeRanking(existingRanking.id as string);
  //   }
  return await unitEvaluationAnswerRepository.delete(id);
  
}

