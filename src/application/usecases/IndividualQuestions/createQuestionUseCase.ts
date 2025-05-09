import { IIndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';

export const createQuestionUseCase = async (
  question: string,
  points: number,
  typeQuestion: 'text' | 'number' | 'yes_no',
  individualQuestionRepository: IIndividualEvaluationQuestionRepository,
  description?: string,
) => {
  return await individualQuestionRepository.create(question, points, typeQuestion, description);
}

