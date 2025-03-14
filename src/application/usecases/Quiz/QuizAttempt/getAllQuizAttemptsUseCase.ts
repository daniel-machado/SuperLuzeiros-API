import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const getAllQuizAttemptsUseCase = async (
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempts = await quizAttemptRepository.findAll();
  
  return {
    attempts
  }
}
