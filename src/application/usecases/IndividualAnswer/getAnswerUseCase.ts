import { IIndividualEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';

export const listAnswerUseCase = async (
  dbvId: string,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository
) => {
  return await individualEvaluationAnswerRepository.findAllByUser(dbvId);
}

