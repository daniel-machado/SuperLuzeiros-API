import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const getAllQuizUserUseCase = async (
  quizRepository: IQuizRepository, 
) => {

  const quizzes = await quizRepository.findAll();

  return {
    quizzes
  };
}
