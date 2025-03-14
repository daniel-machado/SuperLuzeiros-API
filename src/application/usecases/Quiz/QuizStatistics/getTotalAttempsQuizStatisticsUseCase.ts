import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getTotalAttemptQuizStatisticsUseCase = async (
  quizStatisticsRepository: IQuizStatisticsRepository, 
  userId?: string,
  quizId?: string,
) => {

  const stats = await quizStatisticsRepository.getTotalAttempts(quizId, userId)
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
