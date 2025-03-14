// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const createQuizQuestionUseCase = async (
  data: IQuizQuestion,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const newQuestion = await quizQuestionRepository.create(data)
  
  return {
    newQuestion
  }
}
