import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const listActiveEvaluationByIdUseCase = async (
  unitId: string,
  unitEvaluationRepository: IUnitEvaluationRepository, 
) => {
  return await unitEvaluationRepository.findActiveEvaluationByUnitId(unitId);
}