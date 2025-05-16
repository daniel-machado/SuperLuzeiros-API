import { IInidividualRankingRepository } from "../../infrastructure/database/repositories/InidividualRankingRepository";
import { IIndividualEvaluationAnswerRepository } from '../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';
import { IIndividualEvaluationRepository } from '../../infrastructure/database/repositories/IndividualEvaluationRepository';

export const updateTotalScoreIndividual = async (
  userId: string,
  week: number,
  newScore: number,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualRankingRepository: IInidividualRankingRepository
) => {

  // Buscar a avaliação da semana correspondente
  const evaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
  if (!evaluation) throw new Error("Avaliação não encontrada");

  // Buscar todas as respostas daquela semana
  // const answers = await individualEvaluationAnswerRepository.findAllToWeek(userId, week);
  // const additionalPoints = answers.reduce((sum, ans) => sum + Number(ans.score), 0);

  // const total = Number(evaluation.totalScore) + additionalPoints;
  
  const total = Number(evaluation.totalScore || 0) + newScore;
  
  // Atualizar a pontuação final somando `examScore` + respostas adicionais
  await individualEvaluationRepository.updateEvaluation(evaluation.id as string, {
    totalScore: total
  });

  const existingRanking = await individualRankingRepository.findByUserAndWeek(userId as string, week);
  
  if (existingRanking) {
    existingRanking.totalScore = total
    await individualRankingRepository.updateRanking(existingRanking);
  }
};
