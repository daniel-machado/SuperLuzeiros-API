import { IQuizStatistics } from '../../../../infrastructure/database/models/QuizStatistics'; 
import { IQuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';

export const createQuizStatisticsUseCase = async (
  data: IQuizStatistics,
  score: number,
  quizStatisticsRepository: IQuizStatisticsRepository, 
) => {
  const {userId, quizId} = data;

  const existingStatistics = await quizStatisticsRepository.findByUserAndQuiz(userId, quizId);
  if (existingStatistics) {
    // Atualizar estatísticas existentes
    const newAttempts = (existingStatistics.attempts || 0) + 1;
    const newBestScore = Math.max(existingStatistics.bestScore || 0, score);
    const newAverageScore = ((existingStatistics.averageScore || 0) * (newAttempts - 1) + score) / newAttempts;

    await quizStatisticsRepository.update(existingStatistics.id as string, {
      attempts: newAttempts,
      bestScore: newBestScore,
      averageScore: newAverageScore,
    });
  } else {
    // Criar estatísticas novas
    await quizStatisticsRepository.create({
      userId,
      quizId,
      attempts: 1,
      bestScore: score,
      averageScore: score,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
}
