
// infrastructure/database/repositories/QuizUserDetailedAttemptRepository.ts

import { QueryTypes } from "sequelize";
import { User } from "../models";
import { Quiz } from "../models/Quiz";
import { QuizStatistics } from "../models/QuizStatistics";
import { QuizUserAttempt } from "../models/QuizUserAttempt";
import { IQuizUserDetailedAttempt, QuizUserDetailedAttempt } from "../models/QuizUserDetailedAttempt";
import { Specialty } from "../models/Specialty";
import sequelize from "../sequelize";

export interface IQuizUserDetailedAttemptRepository {
  create(data: IQuizUserDetailedAttempt): Promise<IQuizUserDetailedAttempt>;
  update(id: string, data: Partial<IQuizUserDetailedAttempt>): Promise<IQuizUserDetailedAttempt>;
  delete(id: string): Promise<void>;

  findById(id: string): Promise<IQuizUserDetailedAttempt | null>;
  findByAttemptId(attemptId: string): Promise<IQuizUserDetailedAttempt | null>;
  findByUserAndQuiz(userId: string, quizId: string): Promise<IQuizUserDetailedAttempt[] | null>;
  findByUser(userId: string): Promise<IQuizUserDetailedAttempt[] | null>;
}

export const QuizUserDetailedAttemptRepository: IQuizUserDetailedAttemptRepository = {
  create: async (data: IQuizUserDetailedAttempt): Promise<IQuizUserDetailedAttempt> => {
    return await QuizUserDetailedAttempt.create(data);
  },

  update: async (id: string, data: Partial<IQuizUserDetailedAttempt>): Promise<IQuizUserDetailedAttempt> => {
    const detailedAttempt = await QuizUserDetailedAttempt.findByPk(id);
    if (!detailedAttempt) throw new Error('Tentativa detalhada não encontrada.');
    return await detailedAttempt.update(data);
  },

  delete: async (id: string): Promise<void> => {
    const detailedAttempt = await QuizUserDetailedAttempt.findByPk(id);
    if (!detailedAttempt) throw new Error('Tentativa detalhada não encontrada.');
    await detailedAttempt.destroy();
  },

  findById: async (id: string): Promise<IQuizUserDetailedAttempt | null> => {
    return await QuizUserDetailedAttempt.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'photoUrl']
        },
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem']
            }
          ]
        }
      ]
    });
  },

  findByAttemptId: async (attemptId: string): Promise<IQuizUserDetailedAttempt | null> => {
    return await QuizUserDetailedAttempt.findOne({
      where: { attemptId },
      include: [
        {
          model: QuizUserAttempt,
          as: 'attempt',
          attributes: ['id', 'score', 'status', 'attemptDate']
        },
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem']
            }
          ]
        }
      ]
    });
  },

  findByUserAndQuiz: async (userId: string, quizId: string): Promise<IQuizUserDetailedAttempt[] | null> => {
    return await QuizUserDetailedAttempt.findAll({
      where: { userId, quizId },
      order: [['attemptDate', 'DESC']],
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['id', 'name', 'category', 'emblem']
            }
          ]
        },
        {
          model: QuizStatistics,
          as: 'stats',
          attributes: ['attempts', 'bestScore', 'averageScore']
        }
      ]
    });
  },


 findByUser: async (userId: string) => {
  return await sequelize.query(`
    SELECT 
      a.*,
      q.title as "quiz.title",
      s.name as "quiz.specialty.name",
      st."attempts" as "stats.attempts",
      st."bestScore" as "stats.bestScore"
    FROM quiz_user_detailed_attempt a
    LEFT JOIN quiz q ON a."quizId" = q.id
    LEFT JOIN specialty s ON q."specialtyId" = s.id
    LEFT JOIN (
      SELECT DISTINCT ON ("quizId", "userId") *
      FROM quiz_statistics
      WHERE "userId" = :userId
      ORDER BY "quizId", "userId", "createdAt" DESC
    ) st ON st."quizId" = a."quizId" AND st."userId" = a."userId"
    WHERE a."userId" = :userId
    ORDER BY a."attemptDate" DESC
  `, {
    replacements: { userId },
    type: QueryTypes.SELECT,
    nest: true,
    mapToModel: true,
    model: QuizUserDetailedAttempt
  });
}



  // findByUser: async (userId: string): Promise<IQuizUserDetailedAttempt[] | null> => {
  //   return await QuizUserDetailedAttempt.findAll({
  //     where: { userId },
  //     order: [['attemptDate', 'DESC']],
      
  //     include: [
  //       {
  //         model: Quiz,
  //         as: 'quiz',
  //         attributes: ['id', 'title'],
  //         include: [
  //           {
  //             model: Specialty,
  //             as: 'specialty',
  //             attributes: ['id', 'name', 'category', 'emblem']
  //           }
  //         ],
  //       },
  //       {
  //         model: QuizStatistics,
  //         as: 'stats',
  //         attributes: ['attempts', 'bestScore', 'averageScore'],
  //         //separate: true, // Garante que os dados de stats sejam carregados separadamente
  //       }
  //     ],
  //     group: ['quizUserDetailedAttempt.id'], // Agrupa por ID para evitar duplicatas
  //     subQuery: false // Desativa subconsultas para melhor performance
  //   });
  // },

//   findByUser: async (userId: string): Promise<IQuizUserDetailedAttempt[] | null> => {
//     // Primeiro só os attempts
//     const attempts = await QuizUserDetailedAttempt.findAll({
//       where: { userId },
//       order: [['attemptDate', 'DESC']]
//     });
//     console.log(`Número de attempts encontrados: ${attempts.length}`);
    
//     // Depois com includes
//     const attemptsWithIncludes = await QuizUserDetailedAttempt.findAll({
//       where: { userId },
//       order: [['attemptDate', 'DESC']],
//       include: [
//         {
//           model: Quiz,
//           as: 'quiz',
//           attributes: ['id', 'title']
//         }
//       ]
//     });
//     console.log(`Número com include quiz: ${attemptsWithIncludes.length}`);
    
    

// const attemptsWithQuizAndSpecialty = await QuizUserDetailedAttempt.findAll({
//   where: { userId },
//   order: [['attemptDate', 'DESC']],
//   include: [
//     {
//       model: Quiz,
//       as: 'quiz',
//       attributes: ['id', 'title'],
//       include: [
//         {
//           model: Specialty,
//           as: 'specialty',
//           attributes: ['id', 'name', 'category', 'emblem']
//         }
//       ]
//     }
//   ]
// });
// console.log(`Número com include quiz + specialty: ${attemptsWithQuizAndSpecialty.length}`);





// const attemptsWithStats = await QuizUserDetailedAttempt.findAll({
//   where: { userId },
//   order: [['attemptDate', 'DESC']],
//   include: [
//     {
//       model: QuizStatistics,
//       as: 'stats',
//       attributes: ['attempts', 'bestScore', 'averageScore']
//     }
//   ]
// });
// console.log(`Número com include stats: ${attemptsWithStats.length}`);






// const attemptsWithAllIncludes = await QuizUserDetailedAttempt.findAll({
//   where: { userId },
//   order: [['attemptDate', 'DESC']],
//   include: [
//     {
//       model: Quiz,
//       as: 'quiz',
//       attributes: ['id', 'title'],
//       include: [
//         {
//           model: Specialty,
//           as: 'specialty',
//           attributes: ['id', 'name', 'category', 'emblem']
//         }
//       ]
//     },
//     {
//       model: QuizStatistics,
//       as: 'stats',
//       attributes: ['attempts', 'bestScore', 'averageScore']
//     }
//   ]
// });
// console.log(`Número com TODOS includes: ${attemptsWithAllIncludes.length}`);







// const rawData = await sequelize.query(`
//   SELECT * FROM quiz_user_detailed_attempts
//   WHERE userId = :userId
//   ORDER BY attemptDate DESC
// `, {
//   replacements: { userId },
//   type: QueryTypes.SELECT
// });
// console.log(`Número de registros brutos: ${rawData.length}`);








// const joinedData = await sequelize.query(`
//   SELECT a.*, q.title, s.name as specialtyName
//   FROM quiz_user_detailed_attempts a
//   LEFT JOIN quizzes q ON a.quizId = q.id
//   LEFT JOIN specialties s ON q.specialtyId = s.id
//   WHERE a.userId = :userId
//   ORDER BY a.attemptDate DESC
// `, {
//   replacements: { userId },
//   type: QueryTypes.SELECT
// });
// console.log(`Número de registros com JOIN manual: ${joinedData.length}`);





//     return attemptsWithIncludes;
//   },

};





