
import { IDailyVerseReadingRepository } from '../../../infrastructure/database/repositories/DailyVerseRepository'


/**
 * UseCase para obter informações do streak de um usuário
 * 
 * @param userId ID do usuário
 * @param repository Repositório de leituras diárias
 * @returns Objeto com informações do streak do usuário
 */
export const getUserStreakInfoUseCase = async (
  userId: string,
  repository: IDailyVerseReadingRepository,
) => {
  // Buscar o último registro de leitura do usuário
  const latestReading = await repository.findLatestByUserId(userId);

  
  if (!latestReading) {
    // Nenhum registro encontrado, retorna valores iniciais
    return {
      currentStreak: 0,
      lives: 0,
      lastReadingDate: null,
      hasReadToday: false,
    };
  }


  // Verificar se o último registro é de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza a data atual para 00:00:00

  const latestDate = new Date(latestReading.date);
  latestDate.setHours(0, 0, 0, 0); // Normaliza a data da leitura para 00:00:00

  const isToday = latestDate.getTime() === today.getTime();


  // Verificar se o streak ainda é válido (se não é do dia atual, verificar se é de ontem)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0,0,0,0); //Normalize yesterday as well

  const isYesterday = latestDate.getTime() === yesterday.getTime();


  // Se o último registro não é nem de hoje nem de ontem, verificar se tem vidas para manter o streak
  let currentStreak = latestReading.streak;
  let lives = latestReading.life;
  let isStreakActive = isToday || isYesterday;


  if (!isStreakActive && lives > 0) {
    // Calcular quantos dias se passaram desde a última leitura
    const daysDifference = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Se a diferença for menor ou igual ao número de vidas, o streak ainda está ativo
    isStreakActive = daysDifference <= lives;
  }



  // Se o streak não está mais ativo e não tem vidas suficientes, considera como perdido
  if (!isStreakActive && !isToday) {
    currentStreak = 0;
  }



  return {
    currentStreak,
    lives,
    lastReadingDate: latestReading.date,
    hasReadToday: isToday,
    streakActive: isStreakActive
  };

};




