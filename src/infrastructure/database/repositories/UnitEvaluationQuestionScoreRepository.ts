import { IUnitEvaluationQuestion, UnitEvaluationQuestion } from '../models/UnitEvaluationQuestion';
import { UnitEvaluationQuestionScore } from '../models/UnitEvaluationQuestionScore';


export interface IUnitEvaluationQuestionScoreRepository {
  findByUnitEvaluationAndQuestion(unitEvaluationId: string, questionId: string): Promise<UnitEvaluationQuestionScore | null>;
  upsertScore(unitEvaluationId: string, questionId: string, score: number): Promise<UnitEvaluationQuestionScore>;
  getAllByUnitEvaluation(unitEvaluationId: string): Promise<UnitEvaluationQuestionScore[]>;
}

export const UnitEvaluationQuestionScoreRepository = {
  findByUnitEvaluationAndQuestion: async (
    unitEvaluationId: string,
    questionId: string
  ): Promise<UnitEvaluationQuestionScore | null> => {
    return await UnitEvaluationQuestionScore.findOne({
      where: { unitEvaluationId, questionId },
    });
  },

  upsertScore: async (
    unitEvaluationId: string,
    questionId: string,
    score: number
  ): Promise<UnitEvaluationQuestionScore> => {
    const existing = await UnitEvaluationQuestionScore.findOne({
      where: { unitEvaluationId, questionId },
    });

    if (existing) {
      existing.score = score;
      return await existing.save();
    }

    return await UnitEvaluationQuestionScore.create({
      unitEvaluationId,
      questionId,
      score,
    });
  },

  getAllByUnitEvaluation: async (
    unitEvaluationId: string
  ): Promise<UnitEvaluationQuestionScore[]> => {
    return await UnitEvaluationQuestionScore.findAll({
      where: { unitEvaluationId },
    });
  },
};
