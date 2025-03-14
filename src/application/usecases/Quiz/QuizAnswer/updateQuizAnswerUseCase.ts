import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const updateQuizAnswerByIdUseCase = async (
  id: string,
  data: IQuizAnswer,
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const answer = await quizAnswerRepository.update(id, data)
  
  return {
    answer
  }
}
