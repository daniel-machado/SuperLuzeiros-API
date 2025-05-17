import { IDailyVerseReadingRepository } from '../../../infrastructure/database/repositories/DailyVerseRepository'



/**
 * UseCase para obter o histórico de leituras de um usuário
 * 
 * @param userId ID do usuário
 * @param repository Repositório de leituras diárias
 * @returns Array com o histórico de leituras do usuário
 */
export const getUserReadingHistoryUseCase = async (
  userId: string,
  repository: IDailyVerseReadingRepository,
) => {
  // Buscar todos os registros de leitura do usuário (ordenados por data decrescente)
  const readings = await repository.findByUserId(userId);
  
  if (!readings || readings.length === 0) {
    return {
      readings: [],
      totalDays: 0,
      longestStreak: 0
    };
  }


  // Calcular a maior sequência histórica
  let longestStreak = 0;
  readings.forEach(reading => {
    if (reading.streak > longestStreak) {
      longestStreak = reading.streak;
    }
  });


  return {
    readings,
    totalDays: readings.length,
    longestStreak
  };
};


