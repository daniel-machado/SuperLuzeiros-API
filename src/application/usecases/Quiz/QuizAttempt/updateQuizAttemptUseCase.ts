
import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const updateQuizAttemptsUseCase = async (
  id: string,
  data: IQuizUserAttempt,
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempt = await quizAttemptRepository.update(id, data);
  
  return {
    attempt
  }
}
