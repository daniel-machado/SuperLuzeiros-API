// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const getAllQuizQuestionUseCase = async (
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const questions = await quizQuestionRepository.findAll()
  
  return {
    questions
  }
}
