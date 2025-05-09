
import { Unit, UnitEvaluation, UnitEvaluationQuestion } from '../models';
import { IUnitEvaluationAnswer, UnitEvaluationAnswer } from '../models/UnitEvaluationAnswer';

export interface IUnitEvaluationAnswerRepository {
  create(unitId: string, unitEvaluationId: string, questionId: string, answer: string, score: string, week: number, observation?: string): Promise<UnitEvaluationAnswer>;
  findAll(unitId: string): Promise<UnitEvaluationAnswer[]>;
  findById(id: string): Promise<UnitEvaluationAnswer | null>;
  findAllAnswer(): Promise<UnitEvaluationAnswer[]>;
  findAllToWeek(unitId: string, week: number, questionId?: string): Promise<UnitEvaluationAnswer[]>;
  update(id: string, data: Partial<IUnitEvaluationAnswer>): Promise<UnitEvaluationAnswer>;
  delete(id: string): Promise<any>;
}

export const UnitEvaluationAnswerRepository = {
  create: async (unitId: string, 
                unitEvaluationId: string, 
                questionId: string, 
                answer: string, 
                score: string, 
                week: number,
                observation?: string
              ): Promise<UnitEvaluationAnswer> => {
    return await UnitEvaluationAnswer.create({ 
      unitId, 
      unitEvaluationId, 
      questionId, 
      answer, 
      score,
      week,
      observation
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

  findById: async(id: string): Promise<UnitEvaluationAnswer | null> => {
    return await UnitEvaluationAnswer.findOne({
      where: { id }
    })
  },

  findAllAnswer: async (): Promise<UnitEvaluationAnswer[]> => {
    return await UnitEvaluationAnswer.findAll({ 
      include: [
        {
          model: UnitEvaluationQuestion,
          as: 'unitAnswers',
          attributes: ["id", "question", "points"],
          //where: { week, unitId }, // Filtra pela semana e unidade
        },
        {
          model: Unit,
          as: 'unitAnswerToUnit',
          attributes: ["name"]
        }
      ],
    });
  },

  findAllToWeek: async(unitId: string, week: number, questionId?: string): Promise<UnitEvaluationAnswer[]> => {
    const whereClause: any = { unitId, week };
    if (questionId) {
      whereClause.questionId = questionId;
    }
      
    return await UnitEvaluationAnswer.findAll({
      where: whereClause
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
