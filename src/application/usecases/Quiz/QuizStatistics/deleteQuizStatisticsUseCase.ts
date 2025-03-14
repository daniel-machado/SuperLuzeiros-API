import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const deleteQuizStatisticsUseCase = async (
  id: string,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const existingStats = await quizStatisticsRepository.findById(id);
  if (!existingStats) throw new Error('Estatística não encontrada.');

  const statistic = await quizStatisticsRepository.delete(id);
  
  return {
    statistic
  }
}
