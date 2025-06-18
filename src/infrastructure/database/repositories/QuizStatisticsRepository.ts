import { IQuizStatistics, QuizStatistics } from "../models/QuizStatistics";
import { Quiz } from "../models/Quiz";
import { QuizQuestion } from "../models/QuizQuestion";
import { QuizAnswer } from "../models/QuizAnswer";
import { Specialty } from "../models/Specialty";
import { User } from "../models/User";
import { sequelize } from "../models";


export interface IQuizStatisticsRepository {
  create(data: IQuizStatistics): Promise<IQuizStatistics>;
  update(id: string, data: Partial<IQuizStatistics>): Promise<IQuizStatistics>;
  delete(id: string): Promise<IQuizStatistics>;


  findAll(): Promise<IQuizStatistics[] | null>;
  findById(id: string): Promise<IQuizStatistics | null>;
  findByQuiz(quizId: string): Promise<IQuizStatistics | null>;
  findByUserAndQuiz(userId: string, quizId: string): Promise<IQuizStatistics | null>;
  findByUser(userId: string): Promise<IQuizStatistics[] | null>;
  findByUserWithQuizDetails(userId: string): Promise<IQuizStatistics[] | null>;


  getTotalAttempts(quizId?: string, userId?: string): Promise<number | null>;
  getAverageScore(quizId?: string, userId?: string): Promise<number | null>;
  getPassRate(quizId?: string, userId?: string): Promise<number | null>;
}


export const QuizStatisticsRepository = {
  // create – Criação de uma estatística de quiz
  create: async (data: IQuizStatistics): Promise<IQuizStatistics> => {
    return await QuizStatistics.create(data);
  },


  // update – Atualização de estatísticas existentes.
  update: async (id: string, data: Partial<IQuizStatistics>): Promise<IQuizStatistics> => {
    const stats = await QuizStatistics.findByPk(id);
    if (!stats) throw new Error('Estatistica não encontrada.');
    return await stats.update(data);
  },


  // delete – deleção de estatísticas existentes.
  delete: async (id: string): Promise<any> => {
    const stats = await QuizStatistics.findByPk(id);
    if (!stats) throw new Error('Estatistica não encontrada.');
    await stats.destroy();
  },


  // Buscando todas as estatísticas com dados do quiz
  findAll: async (): Promise<IQuizStatistics[] | null> => {
    return await QuizStatistics.findAll({
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'is_active', 'specialtyId'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role', 'photoUrl']
        }
      ]
    });
  },


  // Buscando uma estatistica por ID com dados completos
  findById: async (id: string): Promise<IQuizStatistics | null> => {
    return await QuizStatistics.findOne({ 
      where: { id },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'is_active', 'specialtyId'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem' ]
            },
            {
              model: QuizQuestion,
              as: 'questions',
              attributes: ['id', 'question'],
              include: [
                {
                  model: QuizAnswer,
                  as: 'answers',
                  attributes: ['id', 'answer', 'isCorrect']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role', 'photoUrl']
        }
      ]
    });
  },


  // findByQuiz – Busca estatísticas de um quiz específico.
  findByQuiz: async (quizId: string): Promise<IQuizStatistics | null> => {
    return await QuizStatistics.findOne({ 
      where: { quizId },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'is_active', 'specialtyId'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem' ]
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role', 'photoUrl']
        }
      ]
    });
  },


  // findByUserAndQuiz – Estatísticas filtradas por usuário e quiz
  findByUserAndQuiz: async (userId: string, quizId: string): Promise<IQuizStatistics | null> => {
    return await QuizStatistics.findOne({ 
      where: { userId, quizId },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'is_active', 'specialtyId'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem' ]
            }
          ]
        }
      ]
    });
  },


  // findByUser – Estatísticas gerais do usuário em quizzes (método original)
  findByUser: async (userId: string): Promise<IQuizStatistics[] | null> => {
    return await QuizStatistics.findAll({ where: { userId } });
  },


  // findByUserWithQuizDetails – Estatísticas do usuário COM detalhes completos do quiz
  findByUserWithQuizDetails: async (userId: string): Promise<IQuizStatistics[] | null> => {
    return await QuizStatistics.findAll({ 
      where: { userId },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'specialtyId'],
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
        }
      ],
      order: [['updatedAt', 'DESC']] // Ordenar por mais recentes
    });
  },


  // getTotalAttempts – Soma do total de tentativas.
  getTotalAttempts: async (quizId?: string, userId?: string): Promise<number | null> => {
    const whereClause: any = {};
    if (quizId) whereClause.quizId = quizId;
    if (userId) whereClause.userId = userId;


    const result = await QuizStatistics.sum('attempts', { where: whereClause });
    return result || 0;
  },


  // getAverageScore – Média de pontuação nos quizzes.
  getAverageScore: async (quizId?: string, userId?: string): Promise<number | null> => {
    const whereClause: any = {};
    if (quizId) whereClause.quizId = quizId;
    if (userId) whereClause.userId = userId;


    const result = await QuizStatistics.findOne({
      where: whereClause,
      attributes: [[sequelize.fn('AVG', sequelize.col('averageScore')), 'averageScore']],
      raw: true,
    }) as any;


    return result ? Number(result.averageScore) : 0;
  },


  // getPassRate – Taxa média de aprovação.
  getPassRate: async (quizId?: string, userId?: string): Promise<number | null> => {
    const whereClause: any = {};
    if (quizId) whereClause.quizId = quizId;
    if (userId) whereClause.userId = userId;


    const result = await QuizStatistics.findOne({
      where: whereClause,
      attributes: [[sequelize.fn('AVG', sequelize.col('bestScore')), 'bestScore']],
      raw: true,
    }) as any;


    return result ? Number(result.bestScore) : 0;
  }
};










// import { sequelize } from "../models";
// import { IQuizStatistics, QuizStatistics } from "../models/QuizStatistics";


// export interface IQuizStatisticsRepository {
//   create(data: IQuizStatistics): Promise<IQuizStatistics>;
//   update(id: string, data: Partial<IQuizStatistics>): Promise<IQuizStatistics>;
//   delete(id: string): Promise<IQuizStatistics>;

//   findAll(): Promise<IQuizStatistics[] | null>;
//   findById(id: string): Promise<IQuizStatistics | null>;
//   findByQuiz(quizId: string): Promise<IQuizStatistics | null>;
//   findByUserAndQuiz(userId: string, quizId: string): Promise<IQuizStatistics | null>;
//   findByUser(userId: string): Promise<IQuizStatistics[] | null>;

//   getTotalAttempts(quizId?: string, userId?: string): Promise<IQuizStatistics | number | null>;
//   getAverageScore(quizId?: string, userId?: string): Promise<IQuizStatistics | number | null>;
//   getPassRate(quizId?: string, userId?: string): Promise<IQuizStatistics | number | null>;
// }

// export const QuizStatisticsRepository = {
//   // create – Criação de uma estatística de quiz
//   create: async (data: IQuizStatistics): Promise<IQuizStatistics> => {
//     return await QuizStatistics.create(data);
//   },

//   // update – Atualização de estatísticas existentes.
//   update: async (id: string, data: Partial<IQuizStatistics>): Promise<IQuizStatistics> => {
//     const stats = await QuizStatistics.findByPk(id);
//     if (!stats) throw new Error('Estatistica não encontrada.');
//     return await stats.update(data);
//   },

//   // delete – deleção de estatísticas existentes.
//   delete: async (id: string): Promise<any> => {
//     const stats = await QuizStatistics.findByPk(id);
//     if (!stats) throw new Error('Estatistica não encontrada.');
//     await stats.destroy();
//   },

//   // Buscando todas as estatísticas
//   findAll: async (): Promise<IQuizStatistics[] | null> =>{
//     return await QuizStatistics.findAll();
//   },

//   // Buscando uma estatistica por ID
//   findById: async (id: string): Promise<IQuizStatistics | null> =>{
//     return await QuizStatistics.findOne({ where: { id } });
//   },

//   // findByQuiz – Busca estatísticas de um quiz específico.
//   findByQuiz: async (quizId: string): Promise<IQuizStatistics | null> => {
//     return await QuizStatistics.findOne({ where: { quizId } });
//   },

//   // findByUserAndQuiz – Estatísticas filtradas por usuário e quiz
//   findByUserAndQuiz: async (userId: string, quizId: string): Promise<IQuizStatistics | null> => {
//     return await QuizStatistics.findOne({ where: { userId, quizId } });
//   },

//   // findByUser – Estatísticas gerais do usuário em quizzes.
//   findByUser: async (userId: string): Promise<IQuizStatistics[] | null> => {
//     return await QuizStatistics.findAll({ where: { userId } });
//   },

//   // getTotalAttempts – Soma do total de tentativas.
//   getTotalAttempts: async (quizId?: string, userId?: string): Promise<IQuizStatistics | number | null> => {
//     const whereClause: any = {};
//     if (quizId) whereClause.quizId = quizId;
//     if (userId) whereClause.userId = userId;

//     const result = await QuizStatistics.sum('attempts', { where: whereClause });
//     return result || 0;
//   },

//   // getAverageScore – Média de pontuação nos quizzes.
//   getAverageScore: async (quizId?: string, userId?: string): Promise<IQuizStatistics | number |null> => {
//     const whereClause: any = {};
//     if (quizId) whereClause.quizId = quizId;
//     if (userId) whereClause.userId = userId;

//     const result = await QuizStatistics.findOne({
//       where: whereClause,
//       attributes: [[sequelize.fn('AVG', sequelize.col('averageScore')), 'averageScore']],
//       raw: true,
//     });

//     return result ? result.averageScore : 0;
//   },

//   // getPassRate – Taxa média de aprovação.
//   getPassRate: async (quizId?: string, userId?: string): Promise<IQuizStatistics | number | null> => {
//     const whereClause: any = {};
//     if (quizId) whereClause.quizId = quizId;
//     if (userId) whereClause.userId = userId;

//     const result = await QuizStatistics.findOne({
//       where: whereClause,
//       attributes: [[sequelize.fn('AVG', sequelize.col('bestScore')), 'bestScore']],
//       raw: true,
//     });

//     return result ? result.bestScore : 0;
//   }
// };
