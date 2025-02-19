import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationQuestion } from "../../../infrastructure/database/models/UnitEvaluationQuestion";

export const updateUnitQuestionsUseCase = async (
  id: string,
  data: Partial<IUnitEvaluationQuestion>,
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
) => {

  return await unitEvaluationQuestionRepository.update(id, data);
}

