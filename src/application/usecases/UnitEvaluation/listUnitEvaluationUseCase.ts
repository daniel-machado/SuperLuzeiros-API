import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const listUnitEvaluationUseCase = async (
  unitEvaluationRepository: IUnitEvaluationRepository, 
) => {
  return await unitEvaluationRepository.getUnitEvaluationsByAll();
}