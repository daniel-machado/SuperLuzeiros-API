
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

import { IIndividualEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository";
import { IIndividualEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository";
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

import { updateTotalScoreIndividual } from "../updateTotalScoreIndividual";


export const createAnswerUseCase = async (
  userId: string,
  questionId: string,
  answer: string,
  week: number,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualEvaluationQuestionRepository: IIndividualEvaluationQuestionRepository, 
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,
  
  unitRepository: IUnitRepository,
  
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository

) => {

  const question = await individualEvaluationQuestionRepository.findById(questionId);
  if (!question) throw new Error('Pergunta não encontrada.');

  const answerExisting = await individualEvaluationAnswerRepository.findAllToWeek(userId, week, questionId);
  if (answerExisting.length > 0) throw new Error('Essa pergunta individual já foi respondida');

  // Buscar a avaliação ativa do desbravador
  const dbvEvaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
  console.log("DBV EVALUATION", dbvEvaluation)
  if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador.");

  // const score = answer ? question.points : 0; // Se a resposta for positiva, atribui os pontos.

  // const newAnswer = await individualEvaluationAnswerRepository.create(
  //   userId, 
  //   dbvEvaluation.id, 
  //   questionId, 
  //   answer, 
  //   score,
  //   week
  // );

  // // Atualizar `totalScore` da avaliação correspondente
  // await updateTotalScoreIndividual(
  //   userId,
  //   week, 
  //   individualEvaluationRepository, 
  //   individualEvaluationAnswerRepository,
  //   individualRankingRepository
  // );

  // const unitByUser = await unitRepository.getUnitByUser(userId);
  // if(unitByUser){
  //   const unitId = unitByUser.unitId;
    
  //   // Buscar a avaliação de Unidade da semana correspondente
  //   const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
  //   if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada");

  //   // Buscar a avaliação individual da semana correspondente
  //   const evaluationUser = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
  //   if (!evaluationUser) throw new Error("Avaliação individual não encontrada");

    
  //   const total = Number(evaluationUnit.totalScore) + evaluationUser.totalScore;

  //   // Atualizar a pontuação final da unidade
  //   await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id as string, {
  //     totalScore: total
  //   });

  //   // Atualiza Ranking da Unidade
  //   const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId as string, week);
  //   if (existingRanking) {
  //     existingRanking.totalScore = total
  //     await unitRankingRepository.updateRanking(existingRanking);
  //   }
  
  // }

  // return {
  //   newAnswer
  // }
}

