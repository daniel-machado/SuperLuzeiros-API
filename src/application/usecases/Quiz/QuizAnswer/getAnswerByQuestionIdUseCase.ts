import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const getAnswerByQuestionIdUseCase = async (
  questionId: string,
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const answers = await quizAnswerRepository.findByQuestion(questionId)
  
  return {
    answers
  }
}
