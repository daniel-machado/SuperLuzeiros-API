
import { UnitEvaluation, UnitEvaluationQuestion } from '../models';
import { IUnitEvaluationAnswer, UnitEvaluationAnswer } from '../models/UnitEvaluationAnswer';

export interface IUnitEvaluationAnswerRepository {
  create(unitId: string, unitEvaluationId: string, questionId: string, answer: string, score: string, week: number): Promise<UnitEvaluationAnswer>;
  findAll(unitId: string): Promise<UnitEvaluationAnswer[]>;
  findAllToWeek(unitId: string, week: number): Promise<UnitEvaluationAnswer[]>;
  update(id: string, data: Partial<IUnitEvaluationAnswer>): Promise<UnitEvaluationAnswer>;
  delete(id: string): Promise<any>;
}

export const UnitEvaluationAnswerRepository = {
  create: async (unitId: string, 
                unitEvaluationId: string, 
                questionId: string, 
                answer: string, 
                score: string, 
                week: number
              ): Promise<UnitEvaluationAnswer> => {
    return await UnitEvaluationAnswer.create({ 
      unitId, 
      unitEvaluationId, 
      questionId, 
      answer, 
      score,
      week
    });
  },
  
  findAll: async (unitId: string): Promise<UnitEvaluationAnswer[]> => {
    return await UnitEvaluationAnswer.findAll({ 
      where: { unitId }, 
      include: [
        {
          model: UnitEvaluationQuestion,
          as: 'unitAnswers',
          attributes: ["id", "question", "points"],
          //where: { week, unitId }, // Filtra pela semana e unidade
        },
      ],
    });
  },

  findAllToWeek: async(unitId: string, week: number): Promise<UnitEvaluationAnswer[]> => {
    return await UnitEvaluationAnswer.findAll({where: { unitId, week },
    });
  },

  update: async (id: string, data: Partial<IUnitEvaluationAnswer>): Promise<UnitEvaluationAnswer> => {
    const answer = await UnitEvaluationAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    return await answer.update(data);
  },
  delete: async (id: string): Promise<any> => {
    const answer = await UnitEvaluationAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    await answer.destroy();
  },
}
