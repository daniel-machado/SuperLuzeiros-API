import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getPassRateQuizStatisticsUseCase = async (
  quizStatisticsRepository: IQuizStatisticsRepository, 
  userId?: string,
  quizId?: string,
) => {

  const stats = await quizStatisticsRepository.getPassRate(quizId, userId);
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
