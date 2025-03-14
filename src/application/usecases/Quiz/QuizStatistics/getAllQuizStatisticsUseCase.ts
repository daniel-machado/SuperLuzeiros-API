import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getAllQuizStatisticsUseCase = async (
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const statistics = await quizStatisticsRepository.findAll();
  if (!statistics) throw new Error('Estatística não encontrada.');
  
  return {
    statistics
  }
}
