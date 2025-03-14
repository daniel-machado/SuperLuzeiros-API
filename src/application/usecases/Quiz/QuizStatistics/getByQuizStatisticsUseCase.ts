import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getByQuizStatisticsUseCase = async (
  quizId: string,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const stats = await quizStatisticsRepository.findByQuiz(quizId);
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
