import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationQuestion } from "../../../infrastructure/database/models/UnitEvaluationQuestion";

export const createUnitQuestionsUseCase = async (
  question: string,
  points: number,
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
) => {

  return await unitEvaluationQuestionRepository.create(question, points);
}

