import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listEvaluationUseCase = async (
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {
  return await individualEvaluationRepository.getEvaluationsByAll();
}