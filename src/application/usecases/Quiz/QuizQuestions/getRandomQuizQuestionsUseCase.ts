
// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const getRandomQuizQuestionsUseCase = async (
  quizId: string,
  limit: number = 10,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const questions = await quizQuestionRepository.findRandomQuestions(quizId, limit);
  const count = questions?.length
  
  return {
    count,
    questions
  }
}
