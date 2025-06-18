
import { IQuiz, Quiz } from "../models/Quiz";
import { QuizAnswer } from "../models/QuizAnswer";
import { QuizQuestion } from "../models/QuizQuestion";
import { QuizStatistics } from "../models/QuizStatistics";
import { Specialty } from "../models/Specialty";

export interface IQuizRepository {
  create(data: IQuiz): Promise<IQuiz>;

  findAll(): Promise<IQuiz[] | null>;
  findById(id: string): Promise<IQuiz | null>;
  findBySpecialty(categorySpecialty: string): Promise<IQuiz[] | null>;
  
  update(id: string, data: Partial<IQuiz>): Promise<IQuiz>;
  delete(id: string): Promise<IQuiz>;
}

export const QuizRepository = {
  // Criar Quiz
  create: async (data: IQuiz): Promise<IQuiz> => {
    return await Quiz.create(data);
  },


  // Todas todos os Quizzes com relacionamentos
  findAll: async (): Promise<IQuiz[] | null> => {
    return await Quiz.findAll({
      include: [
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['id', 'name', 'category', 'emblem']
        },
        {
          model: QuizQuestion,
          as: 'questions',
          attributes: ['id', 'question'],
          include: [
            {
              model: QuizAnswer,
              as: 'quizAnswers',
              attributes: ['id', 'answer', 'isCorrect']
            }
          ]
        }
      ]
    });
  },


  // Quiz por ID com relacionamentos completos
  findById: async (id: string): Promise<IQuiz | null> => {
    return await Quiz.findOne({ 
      where: { id },
      include: [
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['id', 'name', 'category', 'emblem']
        },
        {
          model: QuizQuestion,
          as: 'questions',
          attributes: ['id', 'question'],
          include: [
            {
              model: QuizAnswer,
              as: 'quizAnswers',
              attributes: ['id', 'answer', 'isCorrect']
            }
          ]
        },
        {
          model: QuizStatistics,
          as: 'statistics',
          attributes: ['id', 'userId', 'attempts', 'bestScore', 'averageScore']
        }
      ]
    });
  },


  // Quiz por Especialidade com relacionamentos
  findBySpecialty: async (specialtyId: string): Promise<IQuiz[] | null> => {
    return await Quiz.findAll({ 
      where: { specialtyId },
      include: [
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['id', 'name', 'description']
        },
        {
          model: QuizQuestion,
          as: 'questions',
          attributes: ['id', 'question'],
          include: [
            {
              model: QuizAnswer,
              as: 'quizAnswers',
              attributes: ['id', 'answer', 'isCorrect']
            }
          ]
        }
      ]
    });
  },


  // Atualizar Quiz
  update: async (id: string, data: Partial<IQuiz>): Promise<IQuiz> => {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) throw new Error('Quiz não encontrado.');
    return await quiz.update(data);
  },


  // Deletar Quiz
  delete: async (id: string): Promise<any> => {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) throw new Error('Quiz não encontrado.');
    await quiz.destroy();
  }






















  // create: async (data: IQuiz): Promise<IQuiz> => {
  //   return await Quiz.create(data);
  // },

  // // TOdas todos os Quizzes
  // findAll: async (): Promise<IQuiz[] | null> =>{
  //   return await Quiz.findAll();
  // },

  // // Quiz por ID
  // findById: async (id: string): Promise<IQuiz | null> =>{
  //   return await Quiz.findOne({ where: { id } });
  // },

  // // Quiz por Especialidade
  // findBySpecialty: async (specialtyId: string): Promise<IQuiz[] | null> =>{
  //   return await Quiz.findAll({ where: { specialtyId } });
  // },

  // // Atualizar Quiz
  // update: async (id: string, data: Partial<IQuiz>): Promise<IQuiz> => {
  //   const quiz = await Quiz.findByPk(id);
  //   if (!quiz) throw new Error('Quiz não encontrado.');
  //   return await quiz.update(data);
  // },

  // // Deletar Quiz
  // delete: async (id: string): Promise<any> => {
  //   const quiz = await Quiz.findByPk(id);
  //   if (!quiz) throw new Error('Quiz não encontrado.');
  //   await quiz.destroy();
  // },
};
