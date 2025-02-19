import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationQuestion } from "../../../infrastructure/database/models/UnitEvaluationQuestion";

export const deleteUnitQuestionsUseCase = async (
  id: string,
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
) => {

  return await unitEvaluationQuestionRepository.delete(id);
}

