
import { IQuiz, Quiz } from "../models/Quiz";

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

  // TOdas todos os Quizzes
  findAll: async (): Promise<IQuiz[] | null> =>{
    return await Quiz.findAll();
  },

  // Quiz por ID
  findById: async (id: string): Promise<IQuiz | null> =>{
    return await Quiz.findOne({ where: { id } });
  },

  // Quiz por Especialidade
  findBySpecialty: async (specialtyId: string): Promise<IQuiz[] | null> =>{
    return await Quiz.findAll({ where: { specialtyId } });
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
  },
};
