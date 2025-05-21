import { IIndividualEvaluationRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IIndividualEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';
import { updateTotalScoreIndividual } from '../updateTotalScoreIndividual';
import { IInidividualRankingRepository } from '../../../infrastructure/database/repositories/InidividualRankingRepository';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUnitEvaluationRepository } from '../../../infrastructure/database/repositories/UnitEvaluationRepository';
import { IUnitRankingRepository } from '../../../infrastructure/database/repositories/UnitRankingRepository';
import { IndividualEvaluationQuestionRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository';
import { UnitEvaluationQuestionScoreRepository } from '../../../infrastructure/database/repositories/UnitEvaluationQuestionScoreRepository';
import Decimal from 'decimal.js';

export const deleteAnswerUseCase = async (
  id: string,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,
  
  unitRepository: IUnitRepository,
  
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository
) => {
  
  // Buscar a resposta
  const answer = await individualEvaluationAnswerRepository.findOne(id);
  if (!answer) throw new Error("Resposta não encontrada.");

  // =================== INDIVIDUAL ===================

  // Buscar avaliação individual
  const evaluation = await individualEvaluationRepository.getEvaluationById(answer.individualEvaluationId);
  if (!evaluation) throw new Error("Avaliação não encontrada");
  const updatedIndividualTotal = new Decimal(evaluation.totalScore || 0).minus(answer.score).toDecimalPlaces(2);

  // Atualizar avaliação individual
  await individualEvaluationRepository.updateEvaluation(evaluation.id, {
    totalScore: updatedIndividualTotal.toNumber()
  });

  // Atualizar ranking individual
  const existingRanking = await individualRankingRepository.findByUserAndWeek(
    evaluation.userId as string, 
    evaluation.week as number
  );
  if (!existingRanking) throw new Error("Ranking não encontrado");

  if (existingRanking) {
    existingRanking.totalScore = updatedIndividualTotal.toNumber();
    await individualRankingRepository.updateRanking(existingRanking);
  }

  // =================== UNIDADE ===================

  // Buscar unidade do usuário
  const unitUser = await unitRepository.getUnitByUser(evaluation.userId);
  if (!unitUser) throw new Error("Usuário sem unidade");

  // Buscar avaliação da unidade
  const evaluationExisting = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitUser.unitId, answer.week);
  if (!evaluationExisting) throw new Error("Avaliação da unidade não encontrada");

  // Buscar a questão
  const question = await IndividualEvaluationQuestionRepository.findById(answer.questionId);
  if (!question) throw new Error("Pergunta não encontrada");

  // Total de desbravadores ativos
  const totalDbvs = await unitRepository.countDbvsByUnitId(unitUser.unitId);
  if (totalDbvs === 0) throw new Error("Unidade sem desbravadores ativos");

  // Total de desbravadores que responderam essa pergunta (antes da exclusão)
  let answeredCount = await individualEvaluationAnswerRepository.countDbvsThatAnsweredQuestionInUnit(
    unitUser.unitId,
    answer.questionId,
    answer.week
  );

  // Simular estado após a exclusão
  answeredCount = Math.max(0, answeredCount - 1);

  // Buscar pontuação anterior da questão
  const existingQuestionScore = await UnitEvaluationQuestionScoreRepository.findByUnitEvaluationAndQuestion(
    evaluationExisting.id!,
    answer.questionId
  );
  const previousScore = new Decimal(existingQuestionScore?.score || 0);

  // Calcular nova pontuação proporcional da questão
  const newScore = answeredCount > 0
    ? new Decimal(question.points).mul(answeredCount).div(totalDbvs).toDecimalPlaces(2)
    : new Decimal(0);

  // Atualizar score da questão
  await UnitEvaluationQuestionScoreRepository.upsertScore(
    evaluationExisting.id!,
    answer.questionId,
    newScore.toNumber()
  );

  // Calcular diferença entre novo e antigo score
  const scoreDifference = newScore.minus(previousScore);

  // Atualizar total da unidade com base na diferença
  const updatedTotalScore = new Decimal(evaluationExisting.totalScore ?? 0).plus(scoreDifference).toDecimalPlaces(2);

  // Atualizar avaliação da unidade
  await unitEvaluationRepository.updateUnitEvaluation(evaluationExisting.id!, {
    totalScore: updatedTotalScore.toNumber()
  });

  // Atualizar ranking da unidade
  const existingUnitRanking = await unitRankingRepository.findByUnitAndWeek(
    unitUser.unitId,
    answer.week
  );
  if (!existingUnitRanking) throw new Error("Ranking da unidade não encontrado");

  if (existingUnitRanking) {
    existingUnitRanking.totalScore = updatedTotalScore.toNumber();
    await unitRankingRepository.updateRanking(existingUnitRanking);
  }



  // =================== DELETAR RESPOSTA ===================
  await individualEvaluationAnswerRepository.delete(id);

//   const answer = await individualEvaluationAnswerRepository.findOne(id);
//   if (!answer) throw new Error("Resposta não encontrada.");

//   const evaluation = await individualEvaluationRepository.getEvaluationById(answer.individualEvaluationId);
//   const totalUpdate = evaluation.totalScore - answer.score;

//   await individualEvaluationRepository.updateEvaluation(evaluation.id, {
//     totalScore: totalUpdate
//   })

//   const existingRanking = await individualRankingRepository.findByUserAndWeek(
//     evaluation.userId as string, 
//     evaluation.week as number
//   );

//   if (existingRanking) {
//     existingRanking.totalScore -= answer.score
//     await individualRankingRepository.updateRanking(existingRanking);
//   }





// // ############ Atualização da unidade ################
// const unitUser = await unitRepository.getUnitByUser(evaluation.userId);
// if (!unitUser) throw new Error("Usuário sem unidade");

// // Busca a avaliação que está relacionada à resposta
// const evaluationExisting = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitUser.unitId, answer.week);
// if (!evaluationExisting) throw new Error("Avaliação da unidade não encontrada");

// // ⚠️ Buscar a questão para obter os pontos
// const question = await IndividualEvaluationQuestionRepository.findById(answer.questionId);
// if (!question) throw new Error("Pergunta não encontrada");

// // Total de dbvs da unidade
// const totalDbvs = await unitRepository.countDbvsByUnitId(unitUser.unitId);

// // Total que ainda responderam essa questão (após a exclusão)
// const answeredCount = await individualEvaluationAnswerRepository.countDbvsThatAnsweredQuestionInUnit(
//   unitUser.unitId,
//   answer.questionId,
//   answer.week
// );

// // Recalcular pontuação proporcional da questão
// const rate = answeredCount / totalDbvs;
// const newScore = new Decimal(question.points).mul(answeredCount).div(totalDbvs);

// // Buscar pontuação anterior da questão
// const existingQuestionScore = await UnitEvaluationQuestionScoreRepository.findByUnitEvaluationAndQuestion(
//   evaluationExisting.id!,
//   answer.questionId
// );
// const previousScore = new Decimal(existingQuestionScore?.score || 0);

// // Atualizar score da questão
// await UnitEvaluationQuestionScoreRepository.upsertScore(
//   evaluationExisting.id!,
//   answer.questionId,
//   newScore.toNumber()
// );

// // Calcular diferença entre novo e antigo score
// const scoreDifference = newScore.minus(previousScore);

// // Atualizar total da unidade com base na diferença
// const updatedTotalScore = new Decimal(evaluationExisting.totalScore ?? 0).plus(scoreDifference).toDecimalPlaces(2);

// // Atualizar avaliação da unidade
// await unitEvaluationRepository.updateUnitEvaluation(evaluationExisting.id!, {
//   totalScore: updatedTotalScore.toNumber()
// });

// // Atualizar ranking da unidade
// const existingUnitRanking = await unitRankingRepository.findByUnitAndWeek(
//   unitUser.unitId,
//   answer.week
// );

// if (existingUnitRanking) {
//   existingUnitRanking.totalScore = updatedTotalScore.toNumber();
//   await unitRankingRepository.updateRanking(existingUnitRanking);
// }

// // Deletar a resposta
// await individualEvaluationAnswerRepository.delete(id);

}

