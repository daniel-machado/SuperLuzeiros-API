import { sequelize } from "../models";
import { IQuizAnswer, QuizAnswer } from "../models/QuizAnswer";

export interface IQuizAnswerRepository {
  create(data: IQuizAnswer): Promise<IQuizAnswer>;

  findAll(): Promise<IQuizAnswer[] | null>;
  findById(id: string): Promise<IQuizAnswer | null>;
  findByQuestion(questionId: string): Promise<IQuizAnswer[] | null>;
  
  findCorrectAnswers(questionIds: string[]): Promise<any>;

  update(id: string, data: Partial<IQuizAnswer>): Promise<IQuizAnswer>;
  delete(id: string): Promise<IQuizAnswer>;
}

export const QuizAnswerRepository = {
  // Criar answer
  create: async (data: IQuizAnswer): Promise<IQuizAnswer> => {
    return await QuizAnswer.create(data);
  },

  // Todas as answer
  findAll: async (): Promise<IQuizAnswer[] | null> =>{
    return await QuizAnswer.findAll();
  },

  // Answer por ID
  findById: async (id: string): Promise<IQuizAnswer | null> =>{
    return await QuizAnswer.findOne({ where: { id } });
  },

  // Todas as answer de uma question pegando pelo ID
  findByQuestion: async (questionId: string): Promise<IQuizAnswer[] | null> =>{
    return await QuizAnswer.findAll({ where: { questionId } });
  },

  // Busca todas as respostas corretas
  findCorrectAnswers: async (questionIds: string[]): Promise<any> => {
    return await QuizAnswer.findAll({
      where: {
        questionId: questionIds,
        isCorrect: true,
      },
    });
  },

  // Atualizar Answer
  update: async (id: string, data: Partial<IQuizAnswer>): Promise<IQuizAnswer> => {
    const answer = await QuizAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    return await answer.update(data);
  },

  // Deletar answer
  delete: async (id: string): Promise<any> => {
    const answer = await QuizAnswer.findByPk(id);
    if (!answer) throw new Error('Resposta não encontrada.');
    await answer.destroy();
  },
};
