import { IQuizQuestion, QuizQuestion } from "../models/QuizQuestion";
import { sequelize } from "../models";
import { QuizAnswer } from "../models/QuizAnswer";



export interface IQuizQuestionRepository {
  create(data: IQuizQuestion): Promise<IQuizQuestion>;

  findAll(): Promise<IQuizQuestion[] | null>;
  findById(id: string): Promise<IQuizQuestion | null>;
  findAllByQuizId(quizId: string): Promise<IQuizQuestion[] | null>;

  findRandomQuestions(quizId: string, limit: number): Promise<IQuizQuestion[] | null>;
  
  update(id: string, data: Partial<IQuizQuestion>): Promise<IQuizQuestion>;
  delete(id: string): Promise<IQuizQuestion>;
}

export const QuizQuestionRepository = {
  // Criar question
  create: async (data: IQuizQuestion): Promise<IQuizQuestion> => {
    return await QuizQuestion.create(data);
  },

  // Todas as questions
  findAll: async (): Promise<IQuizQuestion[] | null> =>{
    return await QuizQuestion.findAll();
  },

  // Question por ID
  findById: async (id: string): Promise<IQuizQuestion | null> =>{
    return await QuizQuestion.findOne({ where: { id } });
  },

  // Todas as question de um determinado quiz passado por Parametro
  findAllByQuizId: async (quizId: string): Promise<IQuizQuestion[] | null> =>{
    return await QuizQuestion.findAll({ 
      where: { quizId },
      include: [
        { 
          model: QuizAnswer, 
          as: "quizAnswers", 
          attributes: ["answer", "isCorrect"],
        }
      ],
    });
  },

  // Todas as question de um determinado quiz passado por Parametro com limite de 10 perguntas
  findRandomQuestions: async (quizId: string, limit: number = 10): Promise<IQuizQuestion[] | null> =>{
    return await QuizQuestion.findAll({ 
      where: { quizId }, 
      order: sequelize.random(), 
      limit, 
      include: [
        { 
          model: QuizAnswer, 
          as: "quizAnswers", 
          order: sequelize.random(), 
        }
      ],
    });
  },

  // Atualizar question
  update: async (id: string, data: Partial<IQuizQuestion>): Promise<IQuizQuestion> => {
    const question = await QuizQuestion.findByPk(id);
    if (!question) throw new Error('Question não encontrada.');
    return await question.update(data);
  },

  // Deletar question
  delete: async (id: string): Promise<any> => {
    const question = await QuizQuestion.findByPk(id);
    if (!question) throw new Error('Question não encontrada.');
    await question.destroy();
  },
};
