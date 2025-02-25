import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";

export const listEvaluationByIdUseCase = async (
  id: string,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
) => {

  return await individualEvaluationRepository.getEvaluationById(id);

}