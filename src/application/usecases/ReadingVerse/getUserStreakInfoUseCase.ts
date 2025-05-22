import { IDailyVerseReadingRepository } from "../../../infrastructure/database/repositories/DailyVerseRepository";
import { startOfDay, differenceInDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Sao_Paulo';

export const getUserStreakInfoUseCase = async (
  userId: string,
  repository: IDailyVerseReadingRepository
) => {
  const latestReading = await repository.findLatestByUserId(userId);

  if (!latestReading) {
    return {
      currentStreak: 0,
      lives: 0,
      lastReadingDate: null,
      hasReadToday: false,
      streakActive: false,
      daysSinceLastReading: null,
      formattedLastDate: null,
      isOnFire: false,
      nextMilestone: 1,
      dateServer: new Date().toISOString(),
      dateServerInZone: toZonedTime(new Date(), timeZone)
    };
  }

  // Data atual no fuso horário correto
  const nowInZone = toZonedTime(new Date(), timeZone);
  const startOfToday = startOfDay(nowInZone);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  // Data da leitura (usando readAt, que tem horário completo)
  const readingDateInZone = toZonedTime(new Date(latestReading.readAt), timeZone);
  const startOfReadingDay = startOfDay(readingDateInZone);

  const hasReadToday = readingDateInZone >= startOfToday && readingDateInZone < endOfToday;
  const daysDiff = differenceInDays(startOfToday, startOfReadingDay);

  const streakActive =
    hasReadToday ||
    daysDiff === 1 ||
    (daysDiff > 1 && latestReading.life >= (daysDiff - 1));

  return {
    currentStreak: streakActive ? latestReading.streak : 0,
    lives: latestReading.life,
    lastReadingDate: latestReading.readAt,
    hasReadToday,
    streakActive,
    daysSinceLastReading: daysDiff,
    formattedLastDate: format(startOfReadingDay, 'PPPP'), // Ex: quarta-feira, 21 de maio de 2025
    isOnFire: hasReadToday && latestReading.streak >= 3,
    nextMilestone: [1, 5, 10, 30, 50, 70, 100].find(m => m > latestReading.streak) || null,
    dateServer: new Date().toISOString(),
    dateServerInZone: nowInZone
  };
};































// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const latestReading = await repository.findLatestByUserId(userId);

//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }

//   // Considerando que latestReading.date é do tipo DATEONLY (sem horário)
//   const todayInZone = startOfDay(toZonedTime(new Date(), timeZone));
//   const lastReadingDate = startOfDay(toZonedTime(new Date(latestReading.date), timeZone));
//   const daysDiff = differenceInDays(todayInZone, lastReadingDate);

//   const hasReadToday = daysDiff === 0;
//   const streakActive = hasReadToday || (daysDiff === 1) || (daysDiff > 1 && latestReading.life >= (daysDiff - 1));

//   return {
//     currentStreak: streakActive ? latestReading.streak : 0,
//     lives: latestReading.life,
//     lastReadingDate: latestReading.readAt,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff,
//     formattedLastDate: format(lastReadingDate, 'PPPP'), // ex: terça-feira, 21 de maio de 2025
//     isOnFire: hasReadToday && latestReading.streak >= 3,
//     nextMilestone: [1, 5, 10, 30, 50, 70, 100].find(m => m > latestReading.streak) || null,
//     dateServer: new Date().toISOString(),
//     dateServerInZone: toZonedTime(new Date(), timeZone)
//   };
// };







































// import { IDailyVerseReadingRepository } from "../../../infrastructure/database/repositories/DailyVerseRepository";

// // import {
// //   startOfToday,
// //   parseISO,
// //   startOfDay,
// //   differenceInDays,
// //   differenceInCalendarDays,
// //   isToday,
// //   isYesterday,
// //   format,

// // } from 'date-fns';

// import { startOfDay, differenceInDays, isToday, format } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

// const timeZone = 'America/Sao_Paulo';

// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const latestReading = await repository.findLatestByUserId(userId);

//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }

//   // Ajuste para o fuso horário local
//   const today = startOfDay(toZonedTime(new Date(), timeZone));
//   const lastReadingDate = startOfDay(
//     toZonedTime(new Date(latestReading.date), timeZone)
//   );
//   const daysDiff = differenceInDays(today, lastReadingDate);

//   const hasReadToday = daysDiff === 0;
//   const currentStreak = latestReading.streak || 0;
//   const lives = latestReading.life || 0;
 

//   const isOnFire = hasReadToday && currentStreak >= 3;
//   const nextMilestone = [1, 5, 10, 30, 50, 70, 100].find(m => m > currentStreak) || null;

//   const streakActive = hasReadToday || (daysDiff === 1) || (daysDiff > 1 && lives >= (daysDiff - 1));

//   return {
//     currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.readAt,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff,
//     formattedLastDate: format(lastReadingDate, 'PPpp'),
//     isOnFire,
//     nextMilestone,
//     dateServer: new Date().toISOString(),
//     dateServer2: toZonedTime(new Date(), timeZone)
//   };
// };


// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }


//   const today = startOfToday();
//   const lastReadingDate = startOfDay(latestReading.date);
//   const daysDiff = differenceInDays(today, lastReadingDate);

//   const sToday = isToday(latestReading.date)

//   console.log("Today", today)
//     console.log("lastReading", lastReadingDate)
//   console.log("dayDiff", daysDiff)
 
//    console.log("data", latestReading.date)

//   const hasReadToday = daysDiff === 0;
//   const hasReadYesterday = daysDiff === 1;


//   let currentStreak = latestReading.streak || 0;
//   let lives = latestReading.life || 0;
//   let streakActive = hasReadToday;


//   if (!hasReadToday) {
//     if (hasReadYesterday) {
//       // Leitura foi feita ontem (ainda pode manter o streak se ler hoje)
//       streakActive = false;
//     } else if (daysDiff > 1 && lives > 0) {
//       // Tentar recuperar streak com vidas
//       const daysCanRecover = daysDiff - 1;
//       if (daysCanRecover <= lives) {
//         lives -= daysCanRecover;
//         streakActive = true;
//         currentStreak += 1;
//       } else {
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }


//   return {
//     //currentStreak: streakActive ? currentStreak : 0,
//     currentStreak: currentStreak,
//     lives,
//     lastReadingDate: latestReading.readAt,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff,

//     //Infirmações adicionais para UI
//     formattedLastDate: format(lastReadingDate, 'PPpp'), // Formato bonito para exibição
//     isOnfire: streakActive && currentStreak >= 3,
//     nextMilestone: [1, 5, 10, 30, 50, 70, 100].find(m => m > currentStreak) || null
//   };
// };








// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Obter a última leitura
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null,
//       formattedLastDate: null
//     };
//   }


//   // 2. Processar datas
//   const today = startOfToday();
//   const lastDate = parseISO(latestReading.date); // Converte DATEONLY para Date
//   const lastReadAt = new Date(latestReading.readAt);


//   // 3. Calcular diferenças
//   const daysDiff = differenceInCalendarDays(today, lastDate);
//   const hasReadToday = isToday(lastReadAt);
//   const readYesterday = isYesterday(lastReadAt);


//   // 4. Determinar status do streak
//   let currentStreak = latestReading.streak || 0;
//   let lives = latestReading.life || 0;
//   let streakActive = hasReadToday;


//   if (!hasReadToday) {
//     if (readYesterday) {
//       // Leitura foi feita ontem - streak continua
//       streakActive = true;
//     } else if (daysDiff > 1 && lives > 0) {
//       // Tentar recuperar streak com vidas
//       const daysCanRecover = daysDiff - 1;
//       if (lives >= daysCanRecover) {
//         lives -= daysCanRecover;
//         streakActive = true;
//       } else {
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }


//   // 5. Formatar resposta
//   return {
//     currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.readAt,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff,
//     formattedLastDate: format(lastReadAt, 'PPpp'), // Formato bonito para exibição
//     // Informações adicionais para UI
//     isOnFire: streakActive && currentStreak >= 3,
//     nextMilestone: [1, 5, 10, 30, 50, 70, 100].find(m => m > currentStreak) || null
//   };
// };









// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Obter a última leitura
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }


//   // 2. Data atual LOCAL (meia-noite)
//   const todayLocal = new Date()
//   todayLocal.setHours(0,0,0,0);

//   // Data da última leitura (convertida para local)
//   const lastReadingDate = new Date(latestReading.date);
//   lastReadingDate.setHours(0,0,0,0)

//   // 4. Cálculo da diferença de dias LOCAIS
//   const daysDiff = Math.floor(
//     ( todayLocal.getTime() - lastReadingDate.getTime() ) /
//     (1000 * 60 * 60 * 24)
//   );

//   // 5. Determinar status (Verificar se a leitura foi feita hoje (LOCAL))
//   const hasReadToday = daysDiff === 0;



//   let currentStreak = latestReading.streak || 0;
//   let lives = latestReading.life || 0;
//   let streakActive = hasReadToday;


//   // 6. Lógica de streak e vidas
//   if (!hasReadToday) {
//     if (daysDiff === 1) {
//       // Leitura foi feita ontem (dias consecutivos)
//       streakActive = true;
//       currentStreak += 1;
//     } else if (daysDiff > 1 && lives > 0) {
//       // Tentar recuperar streak com vidas
//       const daysCanRecover = daysDiff - 1;
//       if (daysCanRecover <= lives) {
//         lives -= daysCanRecover;
//         streakActive = true;
//         currentStreak += 1;
//       } else {
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }

// console.log({currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.readAt, // Mostra o timestamp completo
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff})
//   return {
//     currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.readAt, // Mostra o timestamp completo
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff
//   };
// };
























// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Obter a última leitura
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }


//   // 2. Obter datas como strings YYYY-MM-DD (DATEONLY)
//   const today = new Date().toISOString().split('T')[0]; // Data atual no formato DATEONLY
//   const lastReadingDate = latestReading.date; // Já vem no formato DATEONLY do banco


//   // 3. Converter para Date objects (meia-noite UTC)
//   const todayDate = new Date(today);
//   const lastDate = new Date(lastReadingDate);


//   // 4. Cálculo da diferença de dias
//   const timeDiff = todayDate.getTime() - lastDate.getTime();
//   const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));


//   // 5. Determinar status
//   const hasReadToday = daysDiff === 0;
//   let currentStreak = latestReading.streak || 0;
//   let lives = latestReading.life || 0;
//   let streakActive = hasReadToday;


//   // 6. Lógica de streak e vidas
//   if (!hasReadToday) {
//     if (daysDiff === 1) {
//       // Leitura foi feita ontem (dias consecutivos)
//       streakActive = true;
//       currentStreak += 1;
//     } else if (daysDiff > 1 && lives > 0) {
//       // Tentar recuperar streak com vidas
//       const daysCanRecover = daysDiff - 1;
//       if (daysCanRecover <= lives) {
//         lives -= daysCanRecover;
//         streakActive = true;
//         currentStreak += 1;
//       } else {
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }


//   return {
//     currentStreak,
//     lives,
//     lastReadingDate: latestReading.readAt, // Mostra o timestamp completo
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff
//   };
// };



// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository
// ) => {
//   // 1. Obter a última leitura
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }


//   // 2. Normalização de datas (fuso local)
//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
//   const latestDate = new Date(latestReading.date);
//   latestDate.setHours(0, 0, 0, 0);

//   console.log("now", now)
//     console.log("today", today)
//       console.log("latesDate", latestDate)
//   // 3. Cálculo da diferença de dias
//   const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

//   console.log("dayDiff", daysDiff)
//   // 4. Determinar status
//   const hasReadToday = daysDiff === 0;
//   let currentStreak = latestReading.streak;
//   let lives = latestReading.life;
//   let streakActive = hasReadToday;


//   if (!hasReadToday) {
//     if (daysDiff === 1) {
//       streakActive = true;
//     } else if (daysDiff > 1 && lives > 0) {
//       const daysCanRecover = daysDiff - 1;
//       if (daysCanRecover <= lives) {
//         lives -= daysCanRecover;
//         streakActive = true;
//       } else {
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }


//   return {
//     currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.date,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff
//   };
// };
























// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository,
// ) => {
//   // 1. Obter a última leitura do usuário
//   const latestReading = await repository.findLatestByUserId(userId);


//   if (!latestReading) {
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//       streakActive: false,
//       daysSinceLastReading: null
//     };
//   }


//   // 2. Normalizar todas as datas para comparar corretamente
//   const now = new Date();
//   const today = new Date(now);
//   today.setHours(0, 0, 0, 0);


//   const latestDate = new Date(latestReading.date);
//   latestDate.setHours(0, 0, 0, 0);


//   // 3. Calcular diferença de dias (considerando timezone local)
//   const timeDiff = today.getTime() - latestDate.getTime();
//   const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));


//   // 4. Determinar se leu hoje
//   const hasReadToday = daysDiff === 0;


//   // 5. Lógica principal do streak
//   let currentStreak = latestReading.streak;
//   let lives = latestReading.life;
//   let streakActive = hasReadToday;


//   if (!hasReadToday) {
//     // Se não leu hoje, verifica se o streak ainda está ativo
//     if (daysDiff === 1) {
//       // Leu ontem - streak continua ativo até o fim de hoje
//       streakActive = true;
//     } else if (daysDiff > 1 && lives > 0) {
//       // Verifica se tem vidas para manter o streak
//       const daysCanRecover = daysDiff - 1; // Desconta o dia atual
      
//       if (daysCanRecover <= lives) {
//         // Usa vidas para manter o streak
//         lives -= daysCanRecover;
//         streakActive = true;
//       } else {
//         // Perdeu o streak
//         currentStreak = 0;
//         streakActive = false;
//       }
//     } else {
//       // Perdeu o streak
//       currentStreak = 0;
//       streakActive = false;
//     }
//   }


//   // 6. Se o streak está inativo mas tem registro de hoje, algo está errado
//   if (hasReadToday && !streakActive) {
//     console.error('Inconsistência detectada: registro de hoje mas streak inativo');
//     streakActive = true;
//   }


//   return {
//     currentStreak: streakActive ? currentStreak : 0,
//     lives,
//     lastReadingDate: latestReading.date,
//     hasReadToday,
//     streakActive,
//     daysSinceLastReading: daysDiff
//   };
// };

























// import { IDailyVerseReadingRepository } from '../../../infrastructure/database/repositories/DailyVerseRepository'


// /**
//  * UseCase para obter informações do streak de um usuário
//  * 
//  * @param userId ID do usuário
//  * @param repository Repositório de leituras diárias
//  * @returns Objeto com informações do streak do usuário
//  */
// export const getUserStreakInfoUseCase = async (
//   userId: string,
//   repository: IDailyVerseReadingRepository,
// ) => {
//   // Buscar o último registro de leitura do usuário
//   const latestReading = await repository.findLatestByUserId(userId);

  
//   if (!latestReading) {
//     // Nenhum registro encontrado, retorna valores iniciais
//     return {
//       currentStreak: 0,
//       lives: 0,
//       lastReadingDate: null,
//       hasReadToday: false,
//     };
//   }


//   // Verificar se o último registro é de hoje
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Normaliza a data atual para 00:00:00

//   const latestDate = new Date(latestReading.date);
//   latestDate.setHours(0, 0, 0, 0); // Normaliza a data da leitura para 00:00:00

//   const isToday = latestDate.getTime() === today.getTime();


//   // Verificar se o streak ainda é válido (se não é do dia atual, verificar se é de ontem)
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   yesterday.setHours(0,0,0,0); //Normalize yesterday as well

//   const isYesterday = latestDate.getTime() === yesterday.getTime();


//   // Se o último registro não é nem de hoje nem de ontem, verificar se tem vidas para manter o streak
//   let currentStreak = latestReading.streak;
//   let lives = latestReading.life;
//   let isStreakActive = isToday || isYesterday;


//   if (!isStreakActive && lives > 0) {
//     // Calcular quantos dias se passaram desde a última leitura
//     const daysDifference = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
    
//     // Se a diferença for menor ou igual ao número de vidas, o streak ainda está ativo
//     isStreakActive = daysDifference <= lives;
//   }



//   // Se o streak não está mais ativo e não tem vidas suficientes, considera como perdido
//   if (!isStreakActive && !isToday) {
//     currentStreak = 0;
//   }



//   return {
//     currentStreak,
//     lives,
//     lastReadingDate: latestReading.date,
//     hasReadToday: isToday,
//     streakActive: isStreakActive
//   };

// };




