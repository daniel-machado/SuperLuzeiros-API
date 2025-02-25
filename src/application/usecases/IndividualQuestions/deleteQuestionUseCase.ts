import { IIndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';

export const deleteQuestionUseCase = async (
  id: string,
  individualQuestionRepository: IIndividualEvaluationQuestionRepository, 
) => {
  return await individualQuestionRepository.delete(id);
}

