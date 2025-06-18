import { IQuizUserAttempt, QuizUserAttempt } from "../models/QuizUserAttempt";


export interface IQuizUserAttemptRepository {
  create(data: IQuizUserAttempt): Promise<IQuizUserAttempt>;

  findAll(): Promise<IQuizUserAttempt[] | null>;
  findById(id: string): Promise<IQuizUserAttempt | null>;
  findAttempts(userId: string, quizId: string): Promise<IQuizUserAttempt | null>;

  findAttemptsByUserId(userId: string): Promise<IQuizUserAttempt[] | null>;

  update(id: string, data: Partial<IQuizUserAttempt>): Promise<IQuizUserAttempt>;
  delete(id: string): Promise<IQuizUserAttempt>;
}

export const QuizUserAttemptRepository = {
  // Criar tentativa
  create: async (data: IQuizUserAttempt): Promise<IQuizUserAttempt> => {
    return await QuizUserAttempt.create(data);
  },

  // Todas as tentativa
  findAll: async (): Promise<IQuizUserAttempt[] | null> =>{
    return await QuizUserAttempt.findAll();
  },

  // tentativa por ID
  findById: async (id: string): Promise<IQuizUserAttempt | null> =>{
    return await QuizUserAttempt.findOne({ where: { id } });
  },

  // Todas as tentativa de um user pegando pelo ID do user e Quiz
  findAttempts: async (userId: string, quizId: string): Promise<IQuizUserAttempt | null> =>{
    return await QuizUserAttempt.findOne({ where: { userId, quizId } });
  },

    // Todas as tentativa de um user pegando pelo ID do user
  findAttemptsByUserId: async (userId: string): Promise<IQuizUserAttempt[] | null> =>{
    return await QuizUserAttempt.findAll({ where: { userId } });
  },

  // Atualizar tentativa
  update: async (id: string, data: Partial<IQuizUserAttempt>): Promise<IQuizUserAttempt> => {
    const attempt = await QuizUserAttempt.findByPk(id);
    if (!attempt) throw new Error('Tentativa não encontrada.');
    return await attempt.update(data);
  },

  // Deletar tentativa
  delete: async (id: string): Promise<any> => {
    const attempt = await QuizUserAttempt.findByPk(id);
    if (!attempt) throw new Error('Tentativa não encontrada.');
    await attempt.destroy();
  },
};
