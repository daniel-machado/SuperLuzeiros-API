// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const getAllQuizAnswerUseCase = async (
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const answers = await quizAnswerRepository.findAll()
  
  return {
    answers
  }
}
