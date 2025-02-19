import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";

export const getUniEvaluationUseCase = async (
  id: string,
  unitEvaluationRepository: IUnitEvaluationRepository, 
) => {

  return await unitEvaluationRepository.getUnitEvaluationById(id);

}