import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const getByUserAndQuizStatisticsUseCase = async (
  userId: string,
  quizId: string,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {

  const stats = await quizStatisticsRepository.findByUserAndQuiz(userId, quizId);
  if (!stats) throw new Error('Estatística não encontrada.');

  return {
    stats
  }
}
