import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const updateQuizStatisticsUseCase = async (
  id: string,
  data: IQuizStatistics,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const existingStats = await quizStatisticsRepository.findById(id);
  if (!existingStats) throw new Error('Estatística não encontrada.');

  const statistic = await quizStatisticsRepository.update(id, data);
  
  return {
    statistic
  }
}
