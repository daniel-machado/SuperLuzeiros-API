import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { IIndividualEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository";
import { IIndividualEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository";
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";
import { updateTotalScoreIndividual } from "../updateTotalScoreIndividual";
import { UnitEvaluationQuestionScoreRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionScoreRepository";
import Decimal from "decimal.js";


export const createAnswerUseCase = async (
  userId: string,
  questionId: string,
  counselorId: string,
  evaluationDate: string,
  answer: string,
  week: number,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualEvaluationQuestionRepository: IIndividualEvaluationQuestionRepository,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,
  unitRepository: IUnitRepository,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository,
  observation: string
) => {

  const question = await individualEvaluationQuestionRepository.findById(questionId);
  if (!question) throw new Error('Pergunta não encontrada.');


  // ############ Avaliação Individual ##################

  const alreadyAnswered = await individualEvaluationAnswerRepository.findAllToWeek(userId, week, questionId);
  if (alreadyAnswered.length > 0) throw new Error('Essa pergunta individual já foi respondida.');

  // Regra de pontuação individual
  let score = 0;

  if (question.typeQuestion === 'yes_no') {
    score = answer.toLowerCase() === 'sim' ? question.points : 0;

  } else if (question.typeQuestion === 'number' && answer) {
    const numericAnswer = parseInt(answer, 10);
    if (numericAnswer >= 1 && numericAnswer <= 5) {
      const percentage = numericAnswer * 0.2; // 1 = 20%, ..., 5 = 100%
      score = question.points * percentage;
    }

  } else if (question.typeQuestion === 'text' && answer.trim() !== '') {
    score = question.points;
  }

  // Buscar avaliação individual ativa
  const dbvEvaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
  if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador.");

  // Criar resposta individual
  const newAnswer = await individualEvaluationAnswerRepository.create(
    userId,
    dbvEvaluation.id,
    questionId,
    answer,
    score,
    week,
    observation
  );

  // Atualizar total da avaliação individual
  const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(score);
  
  await individualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
    totalScore: updatedIndividualTotal.toNumber(),
    evaluationDate: new Date()
  });

  // Atualizar ranking individual
  const existingRankingIndividual = await individualRankingRepository.findByUserAndWeek(userId, week);
  if (!existingRankingIndividual) throw new Error("Ranking individual não encontrado");
  if (existingRankingIndividual) {
    existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
    await individualRankingRepository.updateRanking(existingRankingIndividual);
  }

  // ================= AVALIAÇÃO DA UNIDADE =================

  // Buscar unidade do desbravador
  const unitByUser = await unitRepository.getUnitByUser(userId);
  if (!unitByUser) return { newAnswer };

  const unitId = unitByUser.unitId;

  // Buscar avaliação da unidade
  const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
  if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada.");

  // Total de desbravadores ativos na unidade
  const totalDbvs = await unitRepository.countDbvsByUnitId(unitId);
  if (totalDbvs === 0) throw new Error("Unidade sem desbravadores ativos.");

  // Total de desbravadores que já responderam essa pergunta
  const answeredCount = await individualEvaluationAnswerRepository.countDbvsThatAnsweredQuestionInUnit(unitId, questionId, week);

  // Calcular pontuação proporcional da questão para a unidade
  const proportionalScore = new Decimal(question.points).mul(answeredCount).div(totalDbvs).toDecimalPlaces(2);

  // Buscar pontuação anterior da questão na unidade
  const existingQuestionScore = await UnitEvaluationQuestionScoreRepository.findByUnitEvaluationAndQuestion(
    evaluationUnit.id!,
    questionId
  );
  const previousScore = new Decimal(existingQuestionScore?.score || 0);

  // Atualizar score da questão na unidade
  await UnitEvaluationQuestionScoreRepository.upsertScore(
    evaluationUnit.id!,
    questionId,
    proportionalScore.toNumber()
  );

  // Calcular diferença entre novo e antigo score
  const scoreDifference = proportionalScore.minus(previousScore);

  // Atualizar total da unidade com base na diferença
  const updatedUnitTotal = new Decimal(evaluationUnit.totalScore || 0).plus(scoreDifference).toDecimalPlaces(2);
  await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id!, {
    totalScore: updatedUnitTotal.toNumber()
  });

  // Atualizar ranking da unidade
  const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId, week);
  if (existingRanking) {
    existingRanking.totalScore = updatedUnitTotal.toNumber();
    await unitRankingRepository.updateRanking(existingRanking);
  }

  return { newAnswer };



};


// // ############ Avaliação Individual ##################

//   const alreadyAnswered = await individualEvaluationAnswerRepository.findAllToWeek(userId, week, questionId);
//   if (alreadyAnswered.length > 0) throw new Error('Essa pergunta individual já foi respondida.');


//   // Regra de pontuação individual
//   let score = 0;

//   if (question.typeQuestion === 'yes_no') {
//     score = answer.toLowerCase() === 'yes' ? question.points : 0;

//   } else if (question.typeQuestion === 'number' && answer) {
//     const numericAnswer = parseInt(answer, 10);
//     if (numericAnswer >= 1 && numericAnswer <= 5) {
//       const percentage = numericAnswer * 0.2; // 1 = 20%, 2 = 40%, ..., 5 = 100%
//       score = question.points * percentage;
//     }

//   } else if (question.typeQuestion === 'text' && answer.trim() !== '') {
//     score = question.points;
//   }


//   // Avaliação individual ativa
//   const dbvEvaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
//   if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador.");


//   // Criar resposta
//   const newAnswer = await individualEvaluationAnswerRepository.create(
//     userId,
//     dbvEvaluation.id,
//     questionId,
//     answer,
//     score,
//     week,
//     observation
//   );

//   // Buscar a avaliação da semana correspondente
//   const evaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
//   if (!evaluation) throw new Error("Avaliação não encontrada");

//   const total = Number(evaluation.totalScore || 0) + score;
  
//   // Atualizar a pontuação final somando `examScore` + respostas adicionais
//   await individualEvaluationRepository.updateEvaluation(evaluation.id as string, {
//     totalScore: total
//   });

//   const existingRankingIndividual = await individualRankingRepository.findByUserAndWeek(userId as string, week);
  
//   if (existingRankingIndividual) {
//     existingRankingIndividual.totalScore = total
//     await individualRankingRepository.updateRanking(existingRankingIndividual);
//   }


// //   // ================= UNIDADE =================
// //   const unitByUser = await unitRepository.getUnitByUser(userId);
// //   if (!unitByUser) return { newAnswer };


// //   const unitId = unitByUser.unitId;


// //   // Avaliação da unidade da semana
// //   const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
// //   if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada.");


// //   // Total de dbvs da unidade
// //   const totalDbvs = await unitRepository.countDbvsByUnitId(unitId);
// //   if (totalDbvs === 0) throw new Error("Unidade sem desbravadores ativos.");


// //   // Total que já responderam essa questão
// //   const answeredCount = await individualEvaluationAnswerRepository.countDbvsThatAnsweredQuestionInUnit(unitId, questionId, week);

// // // Recalcular a pontuação da questão com base no total de respondentes
// //   const rate = answeredCount / totalDbvs;
// //   const unitScoreFromThisAnswer = question.points * rate;
 
// //   // Somar ao total da unidade
// //   const updatedScore = Number(evaluationUnit.totalScore || 0) + unitScoreFromThisAnswer;


// //   await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id as string, {
// //     totalScore: updatedScore
// //   });


// //   // Atualizar ranking da unidade
// //   const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId as string, week);
// //   if (existingRanking) {
// //     existingRanking.totalScore = updatedScore;
// //     await unitRankingRepository.updateRanking(existingRanking);
// //   }



//   // ================= UNIDADE =================
//   const unitByUser = await unitRepository.getUnitByUser(userId);
//   if (!unitByUser) return { newAnswer };

//   const unitId = unitByUser.unitId;

//   // Avaliação da unidade da semana
//   const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
//   if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada.");

//   // Total de dbvs da unidade
//   const totalDbvs = await unitRepository.countDbvsByUnitId(unitId);
//   if (totalDbvs === 0) throw new Error("Unidade sem desbravadores ativos.");

//   // Total que já responderam essa questão
//   const answeredCount = await individualEvaluationAnswerRepository.countDbvsThatAnsweredQuestionInUnit(unitId, questionId, week);

  
//   // Buscar pontuação anterior da questão na unidade
//   const existingQuestionScore = await UnitEvaluationQuestionScoreRepository.findByUnitEvaluationAndQuestion(
//     evaluationUnit.id!,
//     questionId
//   );

//   const previousScore = new Decimal(existingQuestionScore?.score || 0);

    
//   // Recalcular pontuação proporcional
//   const rate = answeredCount / totalDbvs;
//   const newScore = new Decimal(question.points).mul(answeredCount).div(totalDbvs);



  
//   // Atualizar score da questão
//   await UnitEvaluationQuestionScoreRepository.upsertScore(
//     evaluationUnit.id!,
//     questionId,
//     newScore.toNumber()
//   );


//   // Calcular diferença entre novo e antigo score, Arredondar a diferença
//   const scoreDifference = newScore.minus(previousScore);


  
//   // Atualizar total da unidade com base na diferença, Arredondar o total final
//   const updatedTotalScore = new Decimal(evaluationUnit.totalScore ?? 0).plus(scoreDifference).toDecimalPlaces(2);




//   // // Recalcular o total da unidade com base em todas as questões pontuadas
//   // const allScores = await UnitEvaluationQuestionScoreRepository.getAllByUnitEvaluation(evaluationUnit.id!);
//   // const totalScore = allScores.reduce((sum: number, q: { score: number }) => sum + q.score, 0);

//   // Atualizar avaliação da unidade  
  
//   await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id!, {
//     totalScore: updatedTotalScore.toNumber()
//   });




//   // Atualizar ranking da unidade
//   const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId, week);
//   if (existingRanking) {
//     existingRanking.totalScore = updatedTotalScore.toNumber();
//     await unitRankingRepository.updateRanking(existingRanking);
//   }

























// import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
// import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";

// import { IIndividualEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository";
// import { IIndividualEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationQuestionRepository";
// import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
// import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
// import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

// import { updateTotalScoreIndividual } from "../updateTotalScoreIndividual";


// export const createAnswerUseCase = async (
//   userId: string,
//   questionId: string,
//   counselorId: string,
//   evaluationDate: string,
//   answer: string,
//   week: number,
//   individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
//   individualEvaluationQuestionRepository: IIndividualEvaluationQuestionRepository, 
//   individualEvaluationRepository: IIndividualEvaluationRepository,
//   individualRankingRepository: IInidividualRankingRepository,
  
//   unitRepository: IUnitRepository,
  
//   unitEvaluationRepository: IUnitEvaluationRepository,
//   unitRankingRepository: IUnitRankingRepository,
//   observation: string

// ) => {

//   const question = await individualEvaluationQuestionRepository.findById(questionId);
//   if (!question) throw new Error('Pergunta não encontrada.');

//   const answerExisting = await individualEvaluationAnswerRepository.findAllToWeek(userId, week, questionId);
//   if (answerExisting.length > 0) throw new Error('Essa pergunta individual já foi respondida');

//   // Buscar a avaliação ativa do desbravador
//   const dbvEvaluation = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
//   if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador.");

//   const score = answer ? question.points : 0; // Se a resposta for positiva, atribui os pontos.

//   const newAnswer = await individualEvaluationAnswerRepository.create(
//     userId, 
//     dbvEvaluation.id, 
//     questionId, 
//     answer, 
//     score,
//     week,
//     observation
//   );

//   // Atualizar `totalScore` da avaliação correspondente
//   await updateTotalScoreIndividual(
//     userId,
//     week, 
//     individualEvaluationRepository, 
//     individualEvaluationAnswerRepository,
//     individualRankingRepository
//   );


//   // ATUALIZANDO O LADO DA UNIDADE NA PONTUAÇÃO
  
//   const unitByUser = await unitRepository.getUnitByUser(userId);
//   if (unitByUser) {
//     const unitId = unitByUser.unitId;
  
//     console.log("UNIT", unitByUser)
//     // Buscar a avaliação da unidade da semana
//     const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
//     if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada");
  
//     console.log("EvaluationUNIT", evaluationUnit)
//     // Obter total de dbvs da unidade
//     const totalDbvsInUnit = await unitRepository.countDbvsByUnitId(unitId);
//     if (totalDbvsInUnit === 0) throw new Error("Unidade sem desbravadores ativos.");
//     console.log("totalDbvsInUnit", totalDbvsInUnit)
  
//     // Obter quantidade de dbvs que já fizeram avaliação naquela semana
//     const answeredDbvs = await individualEvaluationRepository.countEvaluatedDbvsByUnitAndWeek(unitId, week);
//     console.log("answeredDbvs", answeredDbvs)
  
//     // Taxa de participação (antes de incluir esse novo)
//     const previousRate = answeredDbvs / totalDbvsInUnit;
  
  
//     // Atual totalScore proporcional
//     const adjustedScore = dbvEvaluation.totalScore * (1 / totalDbvsInUnit); // apenas 1 dbv respondeu agora
//     const total = Number(evaluationUnit.totalScore) + adjustedScore;
//     console.log("adjustedScore", adjustedScore)
//     console.log("total", total)
  
//     // Atualizar avaliação de unidade
//     await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id as string, {
//       totalScore: total
//     });
  
  
//     // Atualizar ranking da unidade
//     const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId as string, week);
//     if (existingRanking) {
//       existingRanking.totalScore = total;
//       await unitRankingRepository.updateRanking(existingRanking);
//     }
//   }

//   return {
//     newAnswer
//   }
// }




  
//   // const unitByUser = await unitRepository.getUnitByUser(userId);
//   // if(unitByUser){
//   //   const unitId = unitByUser.unitId;
    
//   //   // Buscar a avaliação de Unidade da semana correspondente
//   //   const evaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
//   //   if (!evaluationUnit) throw new Error("Avaliação de Unidade não encontrada");

//   //   // Buscar a avaliação individual da semana correspondente
//   //   const evaluationUser = await individualEvaluationRepository.getEvaluationByUserAndWeek(userId, week);
//   //   if (!evaluationUser) throw new Error("Avaliação individual não encontrada");

//   //   const total = Number(evaluationUnit.totalScore) + evaluationUser.totalScore;

//   //   // Atualizar a pontuação final da unidade
//   //   await unitEvaluationRepository.updateUnitEvaluation(evaluationUnit.id as string, {
//   //     totalScore: total
//   //   });

//   //   // Atualiza Ranking da Unidade
//   //   const existingRanking = await unitRankingRepository.findByUnitAndWeek(unitId as string, week);
//   //   if (existingRanking) {
//   //     existingRanking.totalScore = total
//   //     await unitRankingRepository.updateRanking(existingRanking);
//   //   }
  
//   // }