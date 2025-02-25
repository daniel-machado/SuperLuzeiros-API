import { IIndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';

export const getQuestionsUseCase = async (
  IndividualQuestionRepository: IIndividualEvaluationQuestionRepository, 
) => {

  return await IndividualQuestionRepository.findAll();
}

