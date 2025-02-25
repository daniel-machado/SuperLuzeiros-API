import { IUnitEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';

export const getUnitAnswerAllUseCase = async (
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository
) => {
  return await unitEvaluationAnswerRepository.findAllAnswer();
}

