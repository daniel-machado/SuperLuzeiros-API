
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
  unitRankingRepository: IUnitRankingRepository

) => {

  const question = await unitEvaluationQuestionRepository.findById(questionId);
  if (!question) throw new Error('Pergunta não encontrada.');

  const answerExisting = await unitEvaluationAnswerRepository.findAllToWeek(unitId, week);
  if (answerExisting) throw new Error('Essa pergunta já foi respondida');

   // Buscar a avaliação ativa da unidade
  const unitEvaluation = await unitEvaluationRepository.findActiveEvaluationByUnitId(unitId);
  if (!unitEvaluation) throw new Error("Não há avaliação ativa para essa unidade.");

  const score = answer ? question.points : 0; // Se a resposta for positiva, atribui os pontos.

  const newAnswer = await unitEvaluationAnswerRepository.create(
    unitId, 
    unitEvaluation.id, 
    questionId, 
    answer, 
    score.toString(),
    week
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

