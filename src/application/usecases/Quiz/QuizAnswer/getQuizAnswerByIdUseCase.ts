import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const getQuizAnswerByIdUseCase = async (
  id: string,
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const answer = await quizAnswerRepository.findById(id)
  
  return {
    answer
  }
}
