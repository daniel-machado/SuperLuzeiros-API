
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listEvaluationAllByUserAndWeekUseCase = async (
  dbvId: string,
  week: number,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {
  return await individualEvaluationRepository.getEvaluationByUserAndWeek(dbvId, week);

}