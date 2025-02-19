
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const getUnitEvaluationAll = async (
  unitId: string,
  unitEvaluationRepository: IUnitEvaluationRepository, 
) => {
  return await unitEvaluationRepository.getUnitEvaluationsByUnit(unitId);

}