import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listActiveEvaluationByUserUseCase = async (
  dbvId: string,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {
  return await individualEvaluationRepository.findActiveEvaluationByUser(dbvId);
}