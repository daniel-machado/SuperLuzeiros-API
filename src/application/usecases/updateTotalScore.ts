import { IUnitRankingRepository } from "../../infrastructure/database/repositories/UnitRankingRepository";
import { IUnitEvaluationAnswerRepository } from "../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";
import { IUnitEvaluationRepository } from "../../infrastructure/database/repositories/UnitEvaluationRepository";

export const updateTotalScore = async (
  unitId: string,
  week: number,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository,
  unitRankingRepository: IUnitRankingRepository
) => {

  // Buscar a avaliação da semana correspondente
  const evaluation = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
  if (!evaluation) throw new Error("Avaliação não encontrada");

  // Buscar todas as respostas daquela semana
  const answers = await unitEvaluationAnswerRepository.findAllToWeek(unitId, week);
  const additionalPoints = answers.reduce((sum, ans) => sum + Number(ans.score), 0);

  const total = Number(evaluation.examScore) + additionalPoints;

  // Atualizar a pontuação final somando `examScore` + respostas adicionais
  await unitEvaluationRepository.updateUnitEvaluation(evaluation.id as string, {
    totalScore: total
  });

  const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId as string, week);
  
  if (existingRanking) {
    existingRanking.totalScore = total
    await unitRankingRepository.updateRanking(existingRanking);
  }
};
