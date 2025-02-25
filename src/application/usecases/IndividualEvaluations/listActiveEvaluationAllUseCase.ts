
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listActiveEvaluationAllUseCase = async (
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {
  return await individualEvaluationRepository.findActiveEvaluationAll();

}