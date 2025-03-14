import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const getQuizUserUseCase = async (
  id: string,
  quizRepository: IQuizRepository, 
) => {

  const quiz = await quizRepository.findById(id);

  return {
    quiz
  };
}
