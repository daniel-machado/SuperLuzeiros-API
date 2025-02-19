import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const listActiveUnitEvaluationAllUseCase = async (
  unitEvaluationRepository: IUnitEvaluationRepository, 
) => {
  return await unitEvaluationRepository.findActiveEvaluationAll();
}