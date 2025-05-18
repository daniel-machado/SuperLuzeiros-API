import { IDailyVerseReadingRepository } from "../../../infrastructure/database/repositories/DailyVerseRepository";


export const getUserStreakInfoUseCase = async (
  userId: string,
  repository: IDailyVerseReadingRepository
) => {
  // 1. Obter a última leitura
  const latestReading = await repository.findLatestByUserId(userId);


  if (!latestReading) {
    return {
      currentStreak: 0,
      lives: 0,
      lastReadingDate: null,
      hasReadToday: false,
      streakActive: false,
      daysSinceLastReading: null
    };
  }


  // 2. Normalização de datas (fuso local)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const latestDate = new Date(latestReading.date);
  latestDate.setHours(0, 0, 0, 0);


  // 3. Cálculo da diferença de dias
  const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));


  // 4. Determinar status
  const hasReadToday = daysDiff === 0;
  let currentStreak = latestReading.streak;
  let lives = latestReading.life;
  let streakActive = hasReadToday;


  if (!hasReadToday) {
    if (daysDiff === 1) {
      streakActive = true;
    } else if (daysDiff > 1 && lives > 0) {
      const daysCanRecover = daysDiff - 1;
      if (daysCanRecover <= lives) {
        lives -= daysCanRecover;
        streakActive = true;
      } else {
        currentStreak = 0;
        streakActive = false;
      }
    } else {
      currentStreak = 0;
      streakActive = false;
    }
  }


  return {
    currentStreak: streakActive ? currentStreak : 0,
    lives,
    lastReadingDate: latestReading.date,
    hasReadToday,
    streakActive,
    daysSinceLastReading: daysDiff
  };
};
























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




