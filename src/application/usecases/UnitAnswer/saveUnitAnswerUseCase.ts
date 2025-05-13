
import { IUnitEvaluationQuestionRepository } from "../../../infrastructure/database/repositories/UnitEvaluationQuestionRepository";
import { IUnitEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { updateTotalScore } from "../updateTotalScore";

export const saveUnitAnswerUseCase = async (
  unitId: string,
  questionId: string,
  answer: string,
  week: number,
  unitEvaluationQuestionRepository: IUnitEvaluationQuestionRepository, 
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository,
  observation?: string,

) => {

  const question = await unitEvaluationQuestionRepository.findById(questionId);
  if (!question) throw new Error('Pergunta não encontrada.');

  const answerExisting = await unitEvaluationAnswerRepository.findAllToWeek(unitId, week, questionId);
  if (answerExisting.length > 0) throw new Error('Essa pergunta já foi respondida');

   // Buscar a avaliação ativa da unidade
  const unitEvaluation = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitId, week);
  if (!unitEvaluation) throw new Error("Não há avaliação ativa para essa unidade.");

  //const score = answer ? question.points : 0; // Se a resposta for positiva, atribui os pontos.
    // Regra de pontuação individual
    let score = 0;
    if (question.typeQuestion === 'yes_no') {
      score = answer.toLowerCase() === 'sim' ? question.points : 0;
    } else if (question.typeQuestion === 'number' && answer) {
      score = question.points;
    } else if (question.typeQuestion === 'text' && answer.trim() !== '') {
      score = question.points;
    }

  const newAnswer = await unitEvaluationAnswerRepository.create(
    unitId, 
    unitEvaluation.id as string, 
    questionId, 
    answer, 
    score.toString(),
    week,
    observation
  );

  // Atualizar `totalScore` da avaliação correspondente
  await updateTotalScore(
    unitId,
    week, 
    unitEvaluationRepository, 
    unitEvaluationAnswerRepository,
    unitRankingRepository
  );

  return {
    newAnswer
  }
}

