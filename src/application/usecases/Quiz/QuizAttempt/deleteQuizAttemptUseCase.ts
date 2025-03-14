
import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const deleteQuizAttemptsUseCase = async (
  id: string,
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempt = await quizAttemptRepository.delete(id);
  
  return {
    attempt
  }
}
