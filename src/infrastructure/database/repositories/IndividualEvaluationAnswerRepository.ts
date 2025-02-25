
import { UnitEvaluation, IndividualEvaluationQuestion, User, Unit } from '../models';
import { IIndividualEvaluationAnswer, IndividualEvaluationAnswer } from '../models/IndividualEvaluationAnswer';

export interface IIndividualEvaluationAnswerRepository {
  create(userId: string, individualEvaluationId: string, questionId: string, answer: string, score: number, week: number): Promise<IndividualEvaluationAnswer>;
  findAll(): Promise<IndividualEvaluationAnswer[]>;
  findAllByUser(unitId: string): Promise<IndividualEvaluationAnswer[]>;
  findAllToWeek(userId: string, week: number, questionId?: string): Promise<IndividualEvaluationAnswer[]>;
  findOne(id: string): Promise<IndividualEvaluationAnswer | null>;
  update(id: string, data: Partial<IIndividualEvaluationAnswer>): Promise<IndividualEvaluationAnswer>;
  delete(id: string): Promise<any>;
}

export const IndividualEvaluationAnswerRepository = {
  create: async (userId: string, 
                individualEvaluationId: string, 
                questionId: string, 
                answer: string, 
                score: number, 
                week: number
              ): Promise<IndividualEvaluationAnswer> => {
    return await IndividualEvaluationAnswer.create({ 
      userId, 
      individualEvaluationId, 
      questionId, 
      answer, 
      score,
      week
    });
  },
  
  findAll: async (): Promise<IndividualEvaluationAnswer[]> => {
    return await IndividualEvaluationAnswer.findAll({ 
      include: [
        {
          model: IndividualEvaluationQuestion,
          as: 'EvaluationIndividualQuestion',
          attributes: ["id", "question", "points"],
          //where: { week, unitId }, // Filtra pela semana e unidade
        },
        {
          model: User,
          as: 'individualAnswerToUser',
          attributes: ['name']
        },
      ],
    });
  },

  findAllByUser: async (userId: string): Promise<IndividualEvaluationAnswer[]> => {
    return await IndividualEvaluationAnswer.findAll({ 
      where: { userId }, 
      include: [
        {
          model: IndividualEvaluationQuestion,
          as: 'EvaluationIndividualQuestion',
          attributes: ["id", "question", "points"],
          //where: { week, unitId }, // Filtra pela semana e unidade
        },
      ],
    });
  },

  findAllToWeek: async(userId: string,  week: number, questionId?: string): Promise<IndividualEvaluationAnswer[]> => {
    const whereClause: any = { userId, week };
    if (questionId) {
      whereClause.questionId = questionId;
    }
  
    return await IndividualEvaluationAnswer.findAll({
      where: whereClause
    });
  },

  findOne: async (id: string): Promise<IndividualEvaluationAnswer | null> => {
    return await IndividualEvaluationAnswer.findOne({where: { id }});
  },
  
  update: async (id: string, data: Partial<IIndividualEvaluationAnswer>): Promise<IndividualEvaluationAnswer> => {
    const answer = await IndividualEvaluationAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    return await answer.update(data);
  },
  
  delete: async (id: string): Promise<any> => {
    const answer = await IndividualEvaluationAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    await answer.destroy();
  },
}
