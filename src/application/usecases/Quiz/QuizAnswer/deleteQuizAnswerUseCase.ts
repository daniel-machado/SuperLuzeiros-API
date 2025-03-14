import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const deleteQuizAnswerUseCase = async (
  id: string,
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const answer = await quizAnswerRepository.delete(id)
  
  return {
    answer
  }
}
