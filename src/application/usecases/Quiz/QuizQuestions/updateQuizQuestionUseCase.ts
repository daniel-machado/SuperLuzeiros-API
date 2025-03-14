import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const updateQuizQuestionUseCase = async (
  id: string,
  data: IQuizQuestion,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const question = await quizQuestionRepository.update(id, data);
  
  return {
    question
  }
}
