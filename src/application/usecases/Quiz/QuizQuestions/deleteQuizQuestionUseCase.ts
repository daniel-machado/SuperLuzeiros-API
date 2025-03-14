import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const deleteQuizQuestionUseCase = async (
  id: string,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {
  await quizQuestionRepository.delete(id);
}
