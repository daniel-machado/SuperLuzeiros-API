import { IIndividualEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';

export const getAllAnswerUseCase = async (
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository
) => {
  return await individualEvaluationAnswerRepository.findAll();
}

