import { IIndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';

export const createQuestionUseCase = async (
  question: string,
  points: number,
  individualQuestionRepository: IIndividualEvaluationQuestionRepository
) => {
  return await individualQuestionRepository.create(question, points);
}

