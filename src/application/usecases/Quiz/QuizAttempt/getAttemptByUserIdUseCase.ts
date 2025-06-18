
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const getAttemptByUserIdUseCase = async (
  userId: string,
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempts = await quizAttemptRepository.findAttemptsByUserId(userId);

  return {
    attempts
  }
}