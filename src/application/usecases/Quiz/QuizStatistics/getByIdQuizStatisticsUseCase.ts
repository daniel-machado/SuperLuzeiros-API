import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getByIdQuizStatisticsUseCase = async (
  id: string,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const stats = await quizStatisticsRepository.findById(id);
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
