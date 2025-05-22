

import { IndividualEvaluationRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IDailyVerseReading } from '../../../infrastructure/database/models/dailyVerseReading';
import { IDailyVerseReadingRepository } from '../../../infrastructure/database/repositories/DailyVerseRepository';
import Decimal from 'decimal.js';
import { IndividualRankingRepository } from '../../../infrastructure/database/repositories/InidividualRankingRepository';
import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository';


// import { 
//   startOfToday, 
//   startOfDay, 
//   isToday, 
//   isYesterday, 
//   differenceInDays,
//   parseISO,
//   format
// } from 'date-fns';

// import { startOfDay, differenceInDays } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

// const timeZone = 'America/Sao_Paulo';


import { startOfDay, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Sao_Paulo';

export const registerDailyReadingUseCase = async (
  data: IDailyVerseReading,
  repository: IDailyVerseReadingRepository
) => {

  const user = await UserRepository.findUserById(data.userId);
  if (!user) throw new Error('Usuário não encontrado');

  const now = new Date();
  const nowInZone = toZonedTime(now, timeZone);
  const startOfToday = startOfDay(nowInZone);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  // Impede leitura duplicada no mesmo dia
  const alreadyRegistered = await repository.findByUserIdAndDate(data.userId, now);
  if (alreadyRegistered) return alreadyRegistered;

  const latest = await repository.findLatestByUserId(data.userId);
  let streak = 1;
  let life = latest?.life || 0;

  if (latest) {
    const lastReadingDate = toZonedTime(new Date(latest.readAt), timeZone);
    const lastDay = startOfDay(lastReadingDate);
    const daysDiff = differenceInDays(startOfToday, lastDay);

    if (daysDiff === 1) {
      streak = latest.streak + 1;
      life = latest.life; // mantém as vidas
    } else if (daysDiff > 1) {
      const lostLives = daysDiff - 1;
      const remainingLives = Math.max(latest.life - lostLives, 0);
      life = remainingLives;
      streak = remainingLives > 0 ? latest.streak + 1 : 1;
    } else {
      // leitura no mesmo dia ou leitura futura (não esperado)
      streak = latest.streak;
      life = latest.life;
    }
  }

  const milestones = [1, 5, 10, 30, 50, 70, 100];
  if (milestones.includes(streak)) life += 1;

  // Se for DBV, atualiza pontuação individual
  if (user.role === 'dbv') {
    const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
    if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");

    const updatedScore = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
    await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
      totalScore: updatedScore.toNumber(),
    });

    const existingRanking = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
    if (existingRanking) {
      existingRanking.totalScore = updatedScore.toNumber();
      await IndividualRankingRepository.updateRanking(existingRanking);
    }
  } 
  
  const newReading = await repository.create({
    ...data,
    streak,
    life,
    readAt: now,
    date: startOfToday // opcional: registrar a data do dia com hora zerada
  });

  return {
    reading: newReading,
    streakInfo: {
      currentStreak: streak,
      lives: life,
      lastReadingDate: now,
      hasReadToday: true,
      streakActive: true,
      milestoneReached: milestones.includes(streak) ? streak : null,
      dateServer: new Date().toISOString(),
      dateServerInZone: toZonedTime(new Date(), timeZone)
    }
  };
};





// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) throw new Error('Usuário não encontrado');

//   // Normaliza a data atual para o início do dia no fuso de São Paulo
//   const zonedNow = toZonedTime(new Date(), timeZone);
//   const startOfTodayInZone = startOfDay(zonedNow);

//   // Como o campo 'date' no banco é DATEONLY, removemos o horário (mantemos apenas a data)
//   const todayDateOnly = startOfTodayInZone;

//   // Verifica se já há leitura para hoje
//   const existingReading = await repository.findByUserIdAndDate(data.userId, todayDateOnly);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }

//   const latestReading = await repository.findLatestByUserId(data.userId);
//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];

//   if (latestReading?.date) {
//     const lastReadingDate = startOfDay(toZonedTime(new Date(latestReading.date), timeZone));
//     const daysDiff = differenceInDays(startOfTodayInZone, lastReadingDate);

//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life >= (daysDiff - 1)) {
//       streak = latestReading.streak + 1;
//       life -= (daysDiff - 1);
//     }
//   }

//   if (milestones.includes(streak)) life += 1;

//   // Se for DBV, atualiza pontuação individual
//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");

//     const updatedScore = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedScore.toNumber(),
//     });

//     const existingRanking = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRanking) {
//       existingRanking.totalScore = updatedScore.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRanking);
//     }
//   }

//   // Cria nova leitura
//   const newReading = await repository.create({
//     ...data,
//     date: todayDateOnly, // apenas a data (sem hora)
//     readAt: new Date(),   // horário exato em UTC
//     streak,
//     life
//   });

//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: todayDateOnly,
//       hasReadToday: true,
//       streakActive: true,
//       milestoneReached: milestones.includes(streak) ? streak : null,
//       dateServer: new Date().toISOString(),
//       dateServerInZone: toZonedTime(new Date(), timeZone)
//     }
//   };
// };
























// import { startOfDay, differenceInDays } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

// const timeZone = 'America/Sao_Paulo';

// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {

//   // 1 - Ver se o usuário existe
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }

//   // Ajuste para o fuso horário local (mas salva em UTC)
//   const zonedNow = toZonedTime(new Date(), timeZone);
//   const startOfTodayInZone = startOfDay(zonedNow);
//   //const todayUTC = new Date(startOfTodayInZone.getTime() - startOfTodayInZone.getTimezoneOffset() * 60000);
//   const todayUTC = toZonedTime(startOfTodayInZone, timeZone)

//   const existingReading = await repository.findByUserIdAndDate(data.userId, todayUTC);
//   console.log(existingReading)
//   console.log(todayUTC)
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }

//   // Recupera a última leitura para cálculo de Streak e Vida
//   const latestReading = await repository.findLatestByUserId(data.userId);

//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];

//   if (latestReading) {
//     const lastReadingDateInZone = startOfDay(
//       toZonedTime(new Date(latestReading.date ?? 0), timeZone)
//     );
//     const daysDiff = differenceInDays(startOfTodayInZone, lastReadingDateInZone);

//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       const neededLives = daysDiff - 1;
//       if (neededLives <= life) {
//         streak = latestReading.streak + 1;
//         life -= neededLives;
//       }
//     }
//   }

//   if (milestones.includes(streak)) {
//     life += 1;
//   }

//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");

//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });

//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }

//   // Cria nova leitura
//   const newReading = await repository.create({
//     ...data,
//     date: todayUTC, // agora corretamente em UTC
//     readAt: new Date(), // UTC atual
//     streak,
//     life
//   });
//   console.log('Server time (UTC):', new Date().toISOString());
// console.log('Server time (São Paulo):', toZonedTime(new Date(), 'America/Sao_Paulo'));


//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: todayUTC,
//       hasReadToday: true,
//       streakActive: true,
//       milestoneReached: milestones.includes(streak) ? streak : null,
//       dateServer: new Date().toISOString(),
//       dateServer2: toZonedTime(new Date(), 'America/Sao_Paulo')
//     }
//   };
// };




// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }

//   // Ajuste para o fuso horário local
//   const today = startOfDay(toZonedTime(new Date(), timeZone));

//   const existingReading = await repository.findByUserIdAndDate(data.userId, today);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }

//   const latestReading = await repository.findLatestByUserId(data.userId);

//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];

//   if (latestReading) {
//     const lastReadingDate = startOfDay(toZonedTime(new Date(latestReading.date), timeZone));
//     const daysDiff = differenceInDays(today, lastReadingDate);

//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       const neededLives = daysDiff - 1;
//       if (neededLives <= life) {
//         streak = latestReading.streak + 1;
//         life -= neededLives;
//       }
//     }
//   }

//   if (milestones.includes(streak)) {
//     life += 1;
//   }

//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");

//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });

//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }

//   const newReading = await repository.create({
//     ...data,
//     date: today,
//     readAt: new Date(),
//     streak,
//     life
//   });

//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: today,
//       hasReadToday: true,
//       streakActive: true,
//       milestoneReached: milestones.includes(streak) ? streak : null
//     }
//   };
// };





// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {

//   // 1. Validação do usuário
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }


//   // 2. Data atual (meia-noite do dia local)
//   const today = startOfToday();
  
  
//   // 3. Verificação de leitura duplicada
//   const existingReading = await repository.findByUserIdAndDate(data.userId, today);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }


//   // 4. Obter última leitura
//   const latestReading = await repository.findLatestByUserId(data.userId);
  
//   // 5. Cálculo do streak
//   let streak = 1;
//   let life = latestReading?.life || 0;


//   const milestones = [1, 5, 10, 30, 50, 70, 100];


//   if (latestReading) {
//     const lastReadingDate = startOfDay(latestReading.date);
//     const daysDiff = differenceInDays(today, lastReadingDate);


//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       const neededLives = daysDiff - 1;
//       if (neededLives <= life) {
//         streak = latestReading.streak + 1;
//         life -= neededLives;
//       }
//     }
//   }


//   // 6. Verificação de milestones
//   if (milestones.includes(streak)) {
//     life += 1;
//   }


//   // 7. Atribuição de pontos para DBVs (mantido igual)
//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");


//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });


//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }

//   // 8. Criação do registro
//   const newReading = await repository.create({
//     ...data,
//     date: today,
//     readAt: new Date(),
//     streak,
//     life
//   });


//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: today,
//       hasReadToday: true, // Sempre true pois acabou de registrar
//       streakActive: true, // Sempre true após registro
//       milestoneReached: milestones.includes(streak) ? streak : null
//     }
//   };
// };



// import { startOfDay, differenceInDays  } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

// const timeZone = 'America/Sao_Paulo';

// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }

//   // Ajuste para o fuso horário local
//   const today = startOfDay(toZonedTime(new Date(), timeZone));

//   const existingReading = await repository.findByUserIdAndDate(data.userId, today);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }

//   const latestReading = await repository.findLatestByUserId(data.userId);

//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];

//   if (latestReading) {
//     const lastReadingDate = startOfDay(toZonedTime(new Date(latestReading.date), timeZone));
//     const daysDiff = differenceInDays(today, lastReadingDate);

//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       const neededLives = daysDiff - 1;
//       if (neededLives <= life) {
//         streak = latestReading.streak + 1;
//         life -= neededLives;
//       }
//     }
//   }

//   if (milestones.includes(streak)) {
//     life += 1;
//   }

//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");

//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });

//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }

//   const newReading = await repository.create({
//     ...data,
//     date: today,
//     readAt: new Date(),
//     streak,
//     life
//   });

//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: today,
//       hasReadToday: true,
//       streakActive: true,
//       milestoneReached: milestones.includes(streak) ? streak : null
//     }
//   };
// };

// import {
//   startOfToday,
//   format,
//   parseISO,
//   differenceInCalendarDays,
// } from 'date-fns';

// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Validação do usuário
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }


//   // 2. Obter data atual (local)
//   const now = new Date();
//   const today = startOfToday(); // Meia-noite de hoje (local)


//   // 3. Verificação de leitura duplicada
//   const existingReading = await repository.findByUserIdAndDate(data.userId, today);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }


//   // 4. Obter última leitura
//   const latestReading = await repository.findLatestByUserId(data.userId);


//   // 5. Cálculo do streak
//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];


//   if (latestReading) {
//     const lastDate = parseISO(latestReading.date); // Converte DATEONLY para Date
    
//     // Diferença em dias (calendário, ignora horas)
//     const daysDiff = differenceInCalendarDays(today, lastDate);


//     if (daysDiff === 1) {
//       // Leitura consecutiva
//       streak = (latestReading.streak || 0) + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       // Tentar recuperar streak com vidas
//       const daysCanRecover = daysDiff - 1;
//       if (daysCanRecover <= life) {
//         life -= daysCanRecover;
//         streak = (latestReading.streak || 0) + 1;
//       }
//     }
//   }


//   // 6. Verificação de milestones
//   const milestoneReached = milestones.includes(streak) ? streak : null;
//   if (milestoneReached) {
//     life += 1;
//   }


//   // 7. Atribuição de pontos para DBVs
//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");


//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });


//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }


//   // 8. Criação do registro
//   const newReading = await repository.create({
//     ...data,
//     date: format(today, 'yyyy-MM-dd'), // Armazena como DATEONLY
//     readAt: now,
//     streak,
//     life
//   });


//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: today,
//       milestoneReached,
//       nextMilestone: milestones.find(m => m > streak) || null
//     }
//   };
// };











// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Validação do usuário
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }


//   // 2. Normalização de data (fuso local)
//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
//   // 3. Verificação de leitura duplicada
//   const existingReading = await repository.findByUserIdAndDate(data.userId, today);
//   if (existingReading) {
//     const streakInfo = await repository.findStreakInfo(data.userId);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo,
//       existingReadingId: existingReading.id
//     };
//   }


//   // 4. Obter última leitura
//   const latestReading = await repository.findLatestByUserId(data.userId);
  
//   // 5. Cálculo do streak
//   let streak = 1;
//   let life = latestReading?.life || 0;
//   const milestones = [1, 5, 10, 30, 50, 70, 100];


//   if (latestReading) {
//     const lastDate = new Date(latestReading.date);
//     lastDate.setHours(0, 0, 0, 0);
    
//     const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));


//     if (daysDiff === 1) {
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       const neededLives = daysDiff - 1;
//       if (neededLives <= life) {
//         streak = latestReading.streak + 1;
//         life -= neededLives;
//       }
//     }
//   }


//   // 6. Verificação de milestones
//   if (milestones.includes(streak)) {
//     life += 1;
//   }


//   // 7. Atribuição de pontos para DBVs
//   if (user.role === 'dbv') {
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");


//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });


//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }


//   // 8. Criação do registro
//   const newReading = await repository.create({
//     ...data,
//     date: today,
//     readAt: now,
//     streak,
//     life
//   });


//   return {
//     reading: newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       lastReadingDate: today,
//       milestoneReached: milestones.includes(streak) ? streak : null
//     }
//   };
// };
























// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository,
// ) => {
//   // 1. VALIDAÇÃO INICIAL DO USUÁRIO
//   // Verifica se o usuário existe no sistema
//   const user = await UserRepository.findUserById(data.userId);
//   if (!user) {
//     throw new Error('Usuário não encontrado');
//   }


//   // 2. NORMALIZAÇÃO DE DATA
//   // Cria data atual normalizada (00:00:00) para garantir comparações precisas
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   data.date = new Date(today); // Usa a data normalizada para o registro


//   // 3. VERIFICAÇÃO DE LEITURA DUPLICADA
//   // Checa se já existe registro para este usuário na data atual
//   const existingReading = await repository.findByUserIdAndDate(data.userId, data.date);
//   if (existingReading) {
//     // Se já existir, obtém as informações atuais do streak para retornar no erro
//     const streakInfo = await getUserStreakInfoUseCase(data.userId, repository);
//     throw {
//       name: 'ReadingExistsError',
//       message: 'Já existe um registro de leitura para esta data.',
//       streakInfo
//     };
//   }


//   // 4. OBTER ÚLTIMA LEITURA DO USUÁRIO
//   // Busca o registro mais recente para calcular o streak
//   const latestReading = await repository.findLatestByUserId(data.userId);


//   // 5. INICIALIZAÇÃO DE VARIÁVEIS
//   let streak = 1; // Streak padrão para primeira leitura ou reinício
//   let life = latestReading?.life || 0; // Mantém as vidas existentes ou inicia com 0
//   const milestones = [1, 5, 10, 30, 50, 70, 100]; // Dias que concedem vida extra


//   // 6. CÁLCULO DO STREAK
//   if (latestReading) {
//     // Normaliza a data da última leitura para comparação precisa
//     const latestDate = new Date(latestReading.date);
//     latestDate.setHours(0, 0, 0, 0);


//     // Calcula diferença de dias entre a última leitura e hoje
//     const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));


//     if (daysDiff === 0) {
//       // Caso teórico (já verificado acima) - apenas para segurança
//       throw new Error('Registro duplicado detectado após verificação');
//     } else if (daysDiff === 1) {
//       // Leitura consecutiva (dia seguinte) - incrementa o streak
//       streak = latestReading.streak + 1;
//     } else if (daysDiff > 1 && life > 0) {
//       // Tenta usar vidas para manter o streak
//       const daysToRecover = daysDiff - 1; // Desconta o dia atual
//       if (daysToRecover <= life) {
//         // Consegue manter o streak usando vidas
//         streak = latestReading.streak + 1;
//         life -= daysToRecover; // Desconta as vidas utilizadas
//       }
//     }
//     // Se daysDiff > life, mantém streak=1 (reinício do contador)
//   }


//   // 7. VERIFICAÇÃO DE MILESTONES
//   // Concede vida extra ao atingir marcos específicos de dias consecutivos
//   if (streak > 1 && milestones.includes(streak)) {
//     life += 1;
//   }


//   // 8. ATRIBUIÇÃO DE PONTOS (PARA DESBRAVADORES)
//   if (user.role === 'dbv') {
//     // Busca avaliação ativa do desbravador
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador");


//     // Atualiza pontuação total
//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);
//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });


//     // Atualiza ranking individual
//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }


//   // 9. CRIAÇÃO DO REGISTRO NO BANCO DE DADOS
//   const newReading = await repository.create({
//     ...data,
//     streak, // Número atual de dias consecutivos
//     life,   // Quantidade de vidas restantes
//     readAt: new Date() // Marca o momento exato da leitura
//   });


//   // 10. RETORNO DAS INFORMAÇÕES
//   return {
//     newReading, // O registro criado no banco
//     streakInfo: { // Informações resumidas do streak
//       currentStreak: streak,
//       lives: life,
//       hasReadToday: true, // Sempre true pois acabou de registrar
//       streakActive: true, // Sempre true após registro
//       milestoneReached: milestones.includes(streak) ? streak : null,
//       lastReadingDate: newReading.date
//     }
//   };
// };



















































// /**
//  * UseCase para registrar uma leitura diária e atualizar o streak do usuário
//  *
//  * @param data Dados da leitura diária
//  * @param repository Repositório de leituras diárias
//  * @returns Objeto com o novo registro de leitura e informações sobre o streak
//  */
// export const registerDailyReadingUseCase = async (
//   data: IDailyVerseReading,
//   repository: IDailyVerseReadingRepository,
// ) => {

//   const user = await UserRepository.findUserById(data.userId)
//   if(!user){
//     throw new Error('Usuário não encontrado');
//   }
//   // Normaliza a data para o inicio do dia.
//   const normalizedDate = new Date(data.date);
//   normalizedDate.setHours(0, 0, 0, 0);
//   data.date = normalizedDate;
  
//   // Verificar se já existe um registro para esta data e usuário
//   const existingReading = await repository.findByUserIdAndDate(data.userId, data.date);

//   if (existingReading) {
//     throw new Error('Já existe um registro de leitura para esta data.');
//   }


//   // Obter o registro de leitura mais recente do usuário
//   const latestReading = await repository.findLatestByUserId(data.userId);

//   // Calcular se a leitura é consecutiva
//   const today = new Date(data.date);
//   today.setHours(0, 0, 0, 0);
  
//   let streak = 1; // Começa com 1 para o dia atual
//   let life = latestReading?.life || 0;


//   if (latestReading) {
//     const latestDate = new Date(latestReading.date);
//     latestDate.setHours(0, 0, 0, 0);
    
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     yesterday.setHours(0,0,0,0) //Normalize yestarday as well
   
//     // Compara as datas normalizadas
//     const isYesterday = latestDate.getTime() === yesterday.getTime();
//     const isToday = latestDate.getTime() === today.getTime();


//     if (isToday) {
//       // Já registrou hoje, não deveria acontecer (já tratado acima)
//       throw new Error('Já existe um registro de leitura para esta data.');
//     } else if (isYesterday) {
//       // A última leitura foi ontem, incrementa o streak
//       streak = latestReading.streak + 1;
//     } else {
//       // Verificar se possui vida para recuperar o streak
//       if (latestReading.life > 0) {
//         // Calcular quantos dias se passaram desde a última leitura
//         const daysDifference = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
       
//         // Se a diferença for menor ou igual ao número de vidas, usa as vidas para manter o streak
//         if (daysDifference <= latestReading.life) {
//           streak = latestReading.streak + 1;
//           life = latestReading.life - daysDifference; // Deduz as vidas usadas
//         } else {
//           // Passou mais dias do que tem vidas, streak recomeça
//           streak = 1;
//           life = latestReading.life; // Mantém as vidas que tinha
//         }
//       } else {
//         // Sem vidas, streak recomeça
//         streak = 1;
//       }
//     }
//   }


//   // Verificar se atingiu algum milestone para ganhar vida
//   const milestones = [1, 5, 10, 30, 50, 70, 100]; // Dias para ganhar uma vida
 
//   // Se o streak atual está em um dos milestones, adiciona uma vida
//   if (milestones.includes(streak) && !milestones.includes(streak - 1)) {
//     life += 1;
//   }







//   // ######################## Adicionar pontos ############################

//   if( user.role === 'dbv' ){
//     // Buscar avaliação individual ativa
//     const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
//     if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador, Fale com o seu conselheiro.");

//     const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);

//     await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
//       totalScore: updatedIndividualTotal.toNumber(),
//     });

//     // Atualizar ranking individual
//     const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
//     if (existingRankingIndividual) {
//       existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
//       await IndividualRankingRepository.updateRanking(existingRankingIndividual);
//     }
//   }
  


//   // Criar o registro com o streak calculado
//   const newReading = await repository.create({
//     ...data,
//     streak,
//     life,
//     readAt: new Date() // Data e hora atual para o readAt
//   });


//   // Retornar os dados criados junto com as informações de streak
//   return {
//     newReading,
//     streakInfo: {
//       currentStreak: streak,
//       lives: life,
//       hasReadToday: true, // Acabou de ler, então tem leitura hoje
//       streakActive: true, // O streak está ativo quando há leitura no dia atual
//       milestoneReached: milestones.includes(streak) ? streak : null
//     }
//   };
// };


