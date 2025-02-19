import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitEvaluation } from "../../../infrastructure/database/models/UnitEvaluation";
import { IUnitEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";

export const calculateUnitScoreUseCase = async (
  unitId: string,
  examScore: number,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository
) => {
  // Buscar os pontos das respostas adicionais
  const answers = await unitEvaluationAnswerRepository.findAll(unitId);
  const additionalPoints = answers.reduce((sum, ans) => sum + Number(ans.score), 0);

  // Somar os pontos da avaliação com os pontos adicionais
  const finalPoints = examScore + additionalPoints;
  return finalPoints;
};
