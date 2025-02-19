
import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationQuestion } from "../../../infrastructure/database/models/UnitEvaluationQuestion";

export const listUnitQuestionsUseCase = async (
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
) => {

  return await unitEvaluationQuestionRepository.findAll();
}

