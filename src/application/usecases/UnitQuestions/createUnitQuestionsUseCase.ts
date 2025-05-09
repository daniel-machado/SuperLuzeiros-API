import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationQuestion } from "../../../infrastructure/database/models/UnitEvaluationQuestion";

export const createUnitQuestionsUseCase = async (
  question: string,
  points: number,
  typeQuestion: "number" | "text" | "yes_no",
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
  description?: string,
) => {

  return await unitEvaluationQuestionRepository.create(question, points, typeQuestion, description);
}

