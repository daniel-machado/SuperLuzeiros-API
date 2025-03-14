// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const getByIdQuizQuestionUseCase = async (
  id: string,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const question = await quizQuestionRepository.findById(id)
  
  return {
    question
  }
}
