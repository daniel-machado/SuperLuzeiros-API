import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const updateQuizUserUseCase = async (
  id: string,
  data: IQuiz,
  quizRepository: IQuizRepository, 
) => {

  const quiz = await quizRepository.update(id, data);

  return {
    quiz
  };
}
