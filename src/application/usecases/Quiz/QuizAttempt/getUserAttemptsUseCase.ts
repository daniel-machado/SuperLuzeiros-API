
import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const getUserAttemptsUseCase = async (
  userId: string,
  quizId: string,
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempts = await quizAttemptRepository.findAttempts(userId, quizId);
  
  return {
    attempts
  }
}
