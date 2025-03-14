// useCases/QuizQuestion/CreateQuizQuestionUseCase.ts
import { IQuizAnswer } from '../../../../infrastructure/database/models/QuizAnswer';
import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository'

export const createQuizAnswerUseCase = async (
  data: IQuizAnswer,
  quizAnswerRepository: IQuizAnswerRepository, 
) => {

  const countQuestions = await quizAnswerRepository.findByQuestion(data.questionId) || [];
  if (countQuestions?.length >= 4) {
    throw new Error("Essa pergunta já tem o número máximo de respostas permitidas. (4)");
  }
  const newAnswer = await quizAnswerRepository.create(data)
  
  return {
    newAnswer
  }
}
