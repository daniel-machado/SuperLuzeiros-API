import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';

export const getByIdAttemptUseCase = async (
  id: string,
  quizAttemptRepository: IQuizUserAttemptRepository, 
) => {

  const attempt = await quizAttemptRepository.findById(id);
  
  return {
    attempt
  }
}
