import { IIndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';
import { IIndividualEvaluationQuestion } from '../../../infrastructure/database/models/IndividualEvaluationQuestion';

export const updateQuestionUseCase = async (
  id: string,
  data: Partial<IIndividualEvaluationQuestion>,
  individualQuestionRepository: IIndividualEvaluationQuestionRepository, 
) => {

  return await individualQuestionRepository.update(id, data);
}

