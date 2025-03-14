
// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizQuestion } from '../../../../infrastructure/database/models/QuizQuestion';
import { IQuizQuestionRepository } from '../../../../infrastructure/database/repositories/QuizQuestionRepository'

export const getAllByQuizQuestionsUseCase = async (
  quizId: string,
  quizQuestionRepository: IQuizQuestionRepository, 
) => {

  const questions = await quizQuestionRepository.findAllByQuizId(quizId);
  const count = questions?.length;
  
  return {
    count,
    questions
  }
}
