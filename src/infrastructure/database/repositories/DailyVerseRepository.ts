import { Op } from 'sequelize';
import { IDailyVerseReading, DailyVerseReading } from '../models/dailyVerseReading';
import { User } from '../models';
import { format } from 'date-fns';

export interface IDailyVerseReadingRepository {
  create(data: IDailyVerseReading): Promise<IDailyVerseReading>;
  findByUserId(userId: string): Promise<IDailyVerseReading[] | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<IDailyVerseReading | null>;
  findLatestByUserId(userId: string): Promise<IDailyVerseReading | null>;
  getStreakByUserId(userId: string): Promise<number>;
  update(id: string, data: Partial<IDailyVerseReading>): Promise<IDailyVerseReading>;
  delete(id: string): Promise<void>;
  getConsecutiveReadingDays(userId: string): Promise<number>;
  getRecentReadings(userId: string, days: number): Promise<IDailyVerseReading[]>;
  findStreakInfo(userId: string): Promise<{
    currentStreak: number;
    lastReadingDate: Date | null;
    lastReadingId: string | null;
  }>;
}


export const DailyVerseReadingRepository: IDailyVerseReadingRepository = {
  create: async (data: IDailyVerseReading): Promise<IDailyVerseReading> => {
    return await DailyVerseReading.create(data);
  },


  findByUserId: async (userId: string): Promise<IDailyVerseReading[] | null> => {
    return await DailyVerseReading.findAll({ 
      where: { userId }, 
      order: [['date', 'DESC']],
      include: [{
        model: User,
        as: 'userReading',
        attributes: ['name', 'photoUrl', 'role']
      }]
    });
  },


  // findByUserIdAndDate: async (userId: string, date: Date): Promise<IDailyVerseReading | null> => {
  //   // Normaliza a data para o fuso local
  //   const localDate = new Date(date);
  //   localDate.setHours(0, 0, 0, 0);
    
  //   return await DailyVerseReading.findOne({
  //     where: {
  //       userId,
  //       date: localDate
  //     },
  //     include: [{
  //       model: User,
  //       as: 'userReading',
  //       attributes: ['name', 'photoUrl', 'role']
  //     }]
  //   });
  // },
  findByUserIdAndDate: async (userId: string, date: Date): Promise<IDailyVerseReading | null> => {
    // Formata a data para YYYY-MM-DD para comparar com DATEONLY
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return await DailyVerseReading.findOne({
      where: {
        userId,
        date: dateStr
      },
      include: [{
        model: User,
        as: 'userReading',
        attributes: ['name', 'photoUrl', 'role']
      }]
    });
  },

  findLatestByUserId: async (userId: string): Promise<IDailyVerseReading | null> => {
    return await DailyVerseReading.findOne({
      where: { userId },
      order: [['date', 'DESC'], ['readAt', 'DESC']],
      raw: false,
      include: [{
        model: User,
        as: 'userReading',
        attributes: ['name', 'photoUrl', 'role']
      }]
    });
  },


  getStreakByUserId: async (userId: string): Promise<number> => {
    const latestReading = await DailyVerseReading.findOne({
      where: { userId },
      order: [['date', 'DESC']]
    });


    return latestReading?.streak || 0;
  },


  update: async (id: string, data: Partial<IDailyVerseReading>): Promise<IDailyVerseReading> => {
    const reading = await DailyVerseReading.findByPk(id);
    if (!reading) throw new Error('Registro de leitura não encontrado.');
    return await reading.update(data);
  },


  delete: async (id: string): Promise<void> => {
    const reading = await DailyVerseReading.findByPk(id);
    if (!reading) throw new Error('Registro de leitura não encontrado.');
    await reading.destroy();
  },


  getConsecutiveReadingDays: async (userId: string): Promise<number> => {
    const latestReading = await DailyVerseReading.findOne({
      where: { userId },
      order: [['date', 'DESC']]
    });
   
    return latestReading?.streak || 0;
  },


  getRecentReadings: async (userId: string, days: number): Promise<IDailyVerseReading[]> => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
   
    return await DailyVerseReading.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate
        }
      },
      order: [['date', 'DESC']],
      include: [{
        model: User,
        as: 'userReading',
        attributes: ['name', 'photoUrl', 'role']
      }]
    });
  },


  findStreakInfo: async (userId: string): Promise<{
    currentStreak: number;
    lastReadingDate: Date | null;
    lastReadingId: string | null;
  }> => {
    const latestReading = await DailyVerseReading.findOne({
      where: { userId },
      order: [['date', 'DESC'], ['readAt', 'DESC']],
      attributes: ['id', 'streak', 'date']
    });


    return {
      currentStreak: latestReading?.streak || 0,
      lastReadingDate: latestReading?.date || null,
      lastReadingId: latestReading?.id || null
    };
  }
};














// import { Op, Sequelize } from 'sequelize';
// import { IDailyVerseReading, DailyVerseReading } from '../models/dailyVerseReading'
// import sequelize from '../sequelize';


// export interface IDailyVerseReadingRepository {
//   create(data: IDailyVerseReading): Promise<IDailyVerseReading>;
//   findByUserId(userId: string): Promise<IDailyVerseReading[] | null>;
//   findByUserIdAndDate(userId: string, date: Date): Promise<IDailyVerseReading | null>;
//   findLatestByUserId(userId: string): Promise<IDailyVerseReading | null>;
//   getStreakByUserId(userId: string): Promise<number>;
//   update(id: string, data: Partial<IDailyVerseReading>): Promise<IDailyVerseReading>;
//   delete(id: string): Promise<void>;
//   getConsecutiveReadingDays(userId: string): Promise<number>;
//   getRecentReadings(userId: string, days: number): Promise<IDailyVerseReading[]>;
//   // findStreakInfo(userId: string): Promise<{
//   //   currentStreak: number;
//   //   lastReadingDate: Date | null;
//   // }>;
// }


// export const DailyVerseReadingRepository = {
//   // Criar um registro de leitura diária
//   create: async (data: IDailyVerseReading): Promise<IDailyVerseReading> => {
//     return await DailyVerseReading.create(data);
//   },


//   // Buscar todas as leituras de um usuário
//   findByUserId: async (userId: string): Promise<IDailyVerseReading[] | null> => {
//     return await DailyVerseReading.findAll({ where: { userId }, order: [['date', 'DESC']] });
//   },


//   // Buscar uma leitura específica por usuário e data
//   findByUserIdAndDate: async (userId: string, date: Date): Promise<IDailyVerseReading | null> => {
//     // Converte para o inicio e fim do dia
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0,0,0,0);

//     const endOfDate = new Date(date);
//     endOfDate.setHours(23,59,59,999);

//     return await DailyVerseReading.findOne({ 
//       where: { 
//         userId,
//         date: {
//           [Op.between]: [startOfDay, endOfDate]
//         }
//       } 
//     })
//   },


//   // Buscar o registro de leitura mais recente de um usuário
//   findLatestByUserId: async (userId: string): Promise<IDailyVerseReading | null> => {
//     return await DailyVerseReading.findOne({ 
//       where: { userId },
//       order: [['date', 'DESC']],
//       //Garante que retorna o objeto completo
//       raw: false
//     });
//   },


//   // Obter o streak atual do usuário (diretamente do banco, mas vamos calcular no UseCase)
//   getStreakByUserId: async (userId: string): Promise<number> => {
//     const latestReading = await DailyVerseReading.findOne({
//       where: { userId },
//       order: [['date', 'DESC']]
//     });


//     return latestReading?.streak || 0;
//   },


//   // Atualizar um registro de leitura
//   update: async (id: string, data: Partial<IDailyVerseReading>): Promise<IDailyVerseReading> => {
//     const reading = await DailyVerseReading.findByPk(id);
//     if (!reading) throw new Error('Registro de leitura não encontrado.');
//     return await reading.update(data);
//   },


//   // Deletar um registro de leitura
//   delete: async (id: string): Promise<void> => {
//     const reading = await DailyVerseReading.findByPk(id);
//     if (!reading) throw new Error('Registro de leitura não encontrado.');
//     await reading.destroy();
//   },


//   // Obter a quantidade de dias consecutivos de leitura
//   getConsecutiveReadingDays: async (userId: string): Promise<number> => {
//     // Esta função é apenas para referência, usaremos a lógica no UseCase
//     // Aqui retornamos o valor do streak salvo no registro mais recente
//     const latestReading = await DailyVerseReading.findOne({
//       where: { userId },
//       order: [['date', 'DESC']]
//     });
    
//     return latestReading?.streak || 0;
//   },

//   // findStreakInfo: async (userId: string): Promise<{
//   //   currentStreak: number;
//   //   lastReadingDate: Date | null;
//   // }> => {
//   //   // const result = await DailyVerseReading.findOne({
//   //   //   where: { userId },
//   //   //   attributes: [
//   //   //     [sequelize.fn('MAX', sequelize.col('streak')), 'currentStreak'],
//   //   //     [sequelize.fn('MAX', sequelize.col('date')), 'lastReadingDate']
//   //   //   ],
//   //   //   raw: true
//   //   // });


//   //   // return {
//   //   //   currentStreak: result?.currentStreak || 0,
//   //   //   lastReadingDate: result?.lastReadingDate || null
//   //   // };
//   // }


//   // Obter as leituras recentes de um usuário (para cálculo do streak)
//   getRecentReadings: async (userId: string, days: number): Promise<IDailyVerseReading[]> => {
//     // Obtém a data atual e subtrai "days" dias
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
//     const formattedStartDate = startDate.toISOString().split('T')[0];
    
//     return await DailyVerseReading.findAll({
//       where: {
//         userId,
//         date: {
//           [Op.gte]: formattedStartDate
//         }
//       },
//       order: [['date', 'DESC']]
//     });
//   }
// };
















// // // import { DailyVerseReading, IDailyVerseReading } from "../models/dailyVerseReading";
// // // import { Op } from "sequelize";

// // // export interface IDailyVerseReadingRepository {
// // //   create(data: IDailyVerseReading): Promise<IDailyVerseReading>;
// // //   findByUserAndDate(userId: string, date: string): Promise<IDailyVerseReading | null>;
// // //   findAllByUser(userId: string): Promise<IDailyVerseReading[] | null>;
// // //   countReadDays(userId: string): Promise<number>;
// // //   getConsecutiveReadDays(userId: string): Promise<number>;
// // // }

// // // export const DailyVerseReadingRepository: IDailyVerseReadingRepository = {
// // //   // Criar uma leitura diária
// // //   create: async (data: IDailyVerseReading): Promise<IDailyVerseReading> => {
// // //     return await DailyVerseReading.create(data);
// // //   },

// // //   // Verificar se o usuário já leu hoje
// // //   findByUserAndDate: async (userId: string, date: string): Promise<IDailyVerseReading | null> => {
// // //     return await DailyVerseReading.findOne({ where: { userId, date } });
// // //   },

// // //   // Buscar todas as leituras de um usuário
// // //   findAllByUser: async (userId: string): Promise<IDailyVerseReading[] | null> => {
// // //     return await DailyVerseReading.findAll({ where: { userId } });
// // //   },

  
// // //   // Contar quantos dias o usuário leu
// // //   countReadDays: async (userId: string): Promise<number> => {
// // //     return await DailyVerseReading.count({ where: { userId } });
// // //   },

// // //   getConsecutiveReadDays: async (userId: string): Promise<number> => {
// // //     const readings = await DailyVerseReading.findAll({
// // //       where: { userId },
// // //       order: [["date", "DESC"]],
// // //       attributes: ["date"],
// // //     });

// // //     const dates = readings.map(r => new Date(r.date));
// // //     let streak = 0;
// // //     let currentDate = new Date();

// // //     for (const date of dates) {
// // //       const diff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

// // //       if (diff === 0 || diff === 1) {
// // //         streak++;
// // //         currentDate.setDate(currentDate.getDate() - 1);
// // //       } else {
// // //         break;
// // //       }
// // //     }

// // //     return streak;
// // //   }


// // // };



// // export interface DailyVerseReading {
// //   userId: string;
// //   date: Date;
// //   readAt: Date;
// //   pointsEarned: number;
// //   verse: string;
// //   book: string;
// //   chapter: string;
// // }


// // export interface User {
// //   id: string;
// //   role?: string;
// // }


// // export interface DailyVerseStatus {
// //   read: boolean;
// //   readAt: Date | null;
// //   pointsEarned: number;
// // }


// // export interface VerseCountResult {
// //   totalDays: number;
// //   streak: number;
// //   hasReadToday: boolean;
// //   lastRead?: Date | null;
// // }


// // import { DailyVerseReading as Model } from "../models/dailyVerseReading";
// // import { Op } from "sequelize";

// // // export class DailyVerseRepository {
// // //   // Normaliza a data para meia-noite UTC
// // //   private normalizeDate(date: Date): Date {
// // //     const normalized = new Date(date);
// // //     return new Date(Date.UTC(
// // //       normalized.getFullYear(),
// // //       normalized.getMonth(),
// // //       normalized.getDate()
// // //     ));
// // //   }


// // //   async create(data: DailyVerseReading): Promise<DailyVerseReading> {
// // //     return await Model.create({
// // //       ...data,
// // //       date: this.normalizeDate(data.date),
// // //       readAt: new Date()
// // //     });
// // //   }


// // //   async findByUserAndDate(userId: string, date: Date): Promise<DailyVerseReading | null> {
// // //     const normalizedDate = this.normalizeDate(date);
// // //     return await Model.findOne({ 
// // //       where: { 
// // //         userId, 
// // //         date: normalizedDate 
// // //       } 
// // //     });
// // //   }


// // //   async findAllByUser(userId: string): Promise<DailyVerseReading[]> {
// // //     return await Model.findAll({ 
// // //       where: { userId },
// // //       order: [['date', 'DESC']]
// // //     });
// // //   }


// // //   async countReadDays(userId: string): Promise<number> {
// // //     return await Model.count({ where: { userId } });
// // //   }


// // //   async getReadingStatus(userId: string, date: Date): Promise<DailyVerseStatus> {
// // //     const reading = await this.findByUserAndDate(userId, date);
// // //     return {
// // //       read: !!reading,
// // //       readAt: reading?.readAt || null,
// // //       pointsEarned: reading?.pointsEarned || 0
// // //     };
// // //   }


// // //   async getConsecutiveReadDays(userId: string): Promise<VerseCountResult> {
// // //     const readings = await this.findAllByUser(userId);
    
// // //     if (readings.length === 0) {
// // //       return { totalDays: 0, streak: 0, lastRead: null };
// // //     }

// // //     // Filtra leituras passadas (para totalDays)
// // //       const pastReadings = readings.filter(r => 
// // //         this.normalizeDate(r.date) < today
// // //       );

// // //       // Verifica se leu hoje
// // //       const hasReadToday = readings.some(r =>
// // //         this.normalizeDate(r.date).getTime() === today.getTime()
// // //       );

// // //     const today = this.normalizeDate(new Date());
// // //     const yesterday = new Date(today);
// // //     yesterday.setDate(yesterday.getDate() - 1);


// // //     // Verifica se a última leitura foi hoje ou ontem para manter o streak
// // //     const lastReadingDate = this.normalizeDate(readings[0].date);
// // //     const isActiveStreak = lastReadingDate.getTime() === today.getTime() || 
// // //                           lastReadingDate.getTime() === yesterday.getTime();


// // //     let streak = isActiveStreak ? 1 : 0;


// // //     // Calcula o streak real
// // //     for (let i = 1; i < readings.length; i++) {
// // //       const prevDate = this.normalizeDate(readings[i-1].date);
// // //       const currDate = this.normalizeDate(readings[i].date);
      
// // //       const prevDateMinusOne = new Date(prevDate);
// // //       prevDateMinusOne.setDate(prevDate.getDate() - 1);
      
// // //       if (prevDateMinusOne.getTime() === currDate.getTime()) {
// // //         streak++;
// // //       } else {
// // //         break;
// // //       }
// // //     }


// // //     return {
// // //       totalDays: readings.length,
// // //       streak,
// // //       lastRead: readings[0]?.date
// // //     };
// // //   }
// // // }

// // // async getConsecutiveReadDays(userId: string): Promise<VerseCountResult> {
// // //   const today = this.normalizeDate(new Date());
// // //   const readings = await this.findAllByUser(userId);
  
// // //   // Filtra leituras passadas (para totalDays)
// // //   const pastReadings = readings.filter(r => 
// // //     this.normalizeDate(r.date) < today
// // //   );


// // //   // Verifica se leu hoje
// // //   const hasReadToday = readings.some(r =>
// // //     this.normalizeDate(r.date).getTime() === today.getTime()
// // //   );


// // //   // Lógica do streak (como anterior)
// // //   let streak = 0;
// // //   // ... (mantenha sua lógica de cálculo de streak)


// // //   return {
// // //     totalDays: pastReadings.length,
// // //     streak: hasReadToday ? streak + 1 : streak,
// // //     hasReadToday,
// // //     lastRead: readings[0]?.date
// // //   };
// // // }

// // export class DailyVerseRepository {
// //   // Normaliza a data para meia-noite UTC (remove horas/minutos/segundos)
// //   private normalizeDate(date: Date): Date {
// //     return new Date(Date.UTC(
// //       date.getFullYear(),
// //       date.getMonth(),
// //       date.getDate()
// //     ));
// //   }


// //   // Cria um novo registro de leitura
// //   async create(data: DailyVerseReading): Promise<DailyVerseReading> {
// //     return await Model.create({
// //       ...data,
// //       date: this.normalizeDate(data.date),
// //       readAt: new Date()
// //     });
// //   }


// //   // Busca leitura específica por usuário e data
// //   async findByUserAndDate(userId: string, date: Date): Promise<DailyVerseReading | null> {
// //     return await Model.findOne({ 
// //       where: { 
// //         userId, 
// //         date: this.normalizeDate(date)
// //       } 
// //     });
// //   }


// //   // Todas as leituras do usuário (ordenadas por data decrescente)
// //   async findAllByUser(userId: string): Promise<DailyVerseReading[]> {
// //     return await Model.findAll({ 
// //       where: { userId },
// //       order: [['date', 'DESC']]
// //     });
// //   }


// //   // Conta apenas leituras consolidadas (dias anteriores)
// //   async countReadDays(userId: string): Promise<number> {
// //     const today = this.normalizeDate(new Date());
    
// //     return await Model.count({ 
// //       where: { 
// //         userId,
// //         date: {
// //           [Op.lt]: today // Apenas datas anteriores a hoje
// //         }
// //       } 
// //     });
// //   }


// //   // Verifica status atual de leitura
// //   async getReadingStatus(userId: string, date: Date): Promise<DailyVerseStatus> {
// //     const reading = await this.findByUserAndDate(userId, date);
// //     return {
// //       read: !!reading,
// //       readAt: reading?.readAt || null,
// //       pointsEarned: reading?.pointsEarned || 0
// //     };
// //   }


// //   // Lógica completa do streak + totalDays para o frontend
// //   async getConsecutiveReadDays(userId: string): Promise<VerseCountResult> {
// //     const today = this.normalizeDate(new Date());
// //     const allReadings = await this.findAllByUser(userId);
    
// //     if (allReadings.length === 0) {
// //       return { 
// //         totalDays: 0, 
// //         streak: 0, 
// //         hasReadToday: false,
// //         lastRead: null 
// //       };
// //     }


// //     // Separa leituras
// //     const currentReading = allReadings.find(r => 
// //       this.normalizeDate(r.date).getTime() === today.getTime()
// //     );
    
// //     const pastReadings = allReadings.filter(r => 
// //       this.normalizeDate(r.date) < today
// //     );


// //     // Calcula o streak
// //     let streak = 0;
// //     let previousDate = today;
    
// //     for (const reading of allReadings) {
// //       const readingDate = this.normalizeDate(reading.date);
      
// //       // Se for a leitura de hoje, começa o streak
// //       if (readingDate.getTime() === today.getTime()) {
// //         streak = 1;
// //         previousDate = readingDate;
// //         continue;
// //       }
      
// //       // Verifica se é consecutivo
// //       const expectedDate = new Date(previousDate);
// //       expectedDate.setDate(previousDate.getDate() - 1);
      
// //       if (readingDate.getTime() === expectedDate.getTime()) {
// //         streak++;
// //         previousDate = readingDate;
// //       } else {
// //         break;
// //       }
// //     }


// //     return {
// //       totalDays: pastReadings.length, // Só conta dias passados
// //       streak: currentReading ? streak : 0, // Streak só conta se leu hoje
// //       hasReadToday: !!currentReading,
// //       lastRead: allReadings[0]?.date
// //     };
// //   }


// //   // Método adicional para o frontend - status completo
// //   async getFullStatus(userId: string): Promise<{
// //     streak: number;
// //     totalDays: number;
// //     hasReadToday: boolean;
// //     lastRead: Date | null;
// //     allReadings: DailyVerseReading[];
// //   }> {
// //     const today = this.normalizeDate(new Date());
// //     const [readings, count] = await Promise.all([
// //       this.findAllByUser(userId),
// //       this.countReadDays(userId)
// //     ]);


// //     const hasReadToday = readings.some(r => 
// //       this.normalizeDate(r.date).getTime() === today.getTime()
// //     );


// //     const streakResult = await this.getConsecutiveReadDays(userId);


// //     return {
// //       streak: streakResult.streak,
// //       totalDays: count,
// //       hasReadToday,
// //       lastRead: readings[0]?.date || null,
// //       allReadings: readings
// //     };
// //   }
// // }


// import { DailyVerseReading as Model } from "../models/dailyVerseReading";
// import { Op } from "sequelize";
// import { UserRepository } from "./UserRepository";


// interface ReadingResult {
//   totalDays: number;
//   streak: number;
//   hasReadToday: boolean;
//   lastRead?: Date | null;
// }


// export class DailyVerseRepository {
//   private normalizeDate(date: Date): Date {
//     return new Date(Date.UTC(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     ));
//   }


//   async createReading(userId: string, verseData: {
//     verse: string;
//     chapter: string;
//     book: string;
//   }): Promise<ReadingResult> {
//     const today = this.normalizeDate(new Date());
//     const user = await UserRepository.findUserById(userId);
    
//     if (!user) throw new Error("Usuário não encontrado");


//     // Verifica se já leu hoje
//     const existing = await Model.findOne({ 
//       where: { userId, date: today } 
//     });
//     if (existing) throw new Error("Leitura já registrada hoje");


//     // Calcula pontos
//     const points = ['dbv', 'counselor'].includes(user.role ?? '') ? 5 : 0;


//     // Cria a leitura
//     await Model.create({
//       userId,
//       date: today,
//       readAt: new Date(),
//       pointsEarned: points,
//       ...verseData
//     });


//     // Retorna os dados atualizados
//     return this.getCurrentStatus(userId);
//   }


//   async getCurrentStatus(userId: string): Promise<ReadingResult> {
//     const today = this.normalizeDate(new Date());
//     const readings = await Model.findAll({ 
//       where: { userId },
//       order: [['date', 'DESC']]
//     });


//     if (readings.length === 0) {
//       return { totalDays: 0, streak: 0, hasReadToday: false };
//     }


//     // Verifica leitura atual
//     const hasReadToday = readings[0].date.getTime() === today.getTime();


//     // Calcula streak
//     let streak = hasReadToday ? 1 : 0;
//     let currentDate = new Date(today);


//     for (let i = hasReadToday ? 1 : 0; i < readings.length; i++) {
//       const readingDate = this.normalizeDate(readings[i].date);
//       currentDate.setDate(currentDate.getDate() - 1);


//       if (readingDate.getTime() === currentDate.getTime()) {
//         streak++;
//       } else {
//         break;
//       }
//     }


//     return {
//       totalDays: readings.length, // Conta inclusive hoje
//       streak,
//       hasReadToday,
//       lastRead: readings[0]?.date
//     };
//   }
// }
