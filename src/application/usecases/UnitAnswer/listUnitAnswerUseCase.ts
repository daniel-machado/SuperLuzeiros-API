import { IUnitEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';

export const listUnitAnswerUseCase = async (
  unitId: string,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository
) => {
  return await unitEvaluationAnswerRepository.findAll(unitId);
}

