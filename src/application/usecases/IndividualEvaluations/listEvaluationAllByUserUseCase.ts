
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listEvaluationAllByUserUseCase = async (
  dbvId: string,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {
  return await individualEvaluationRepository.getEvaluationByUser(dbvId);

}