import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getByUserQuizStatisticsUseCase = async (
  userId: string,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const stats = await quizStatisticsRepository.findByUserWithQuizDetails(userId);
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
