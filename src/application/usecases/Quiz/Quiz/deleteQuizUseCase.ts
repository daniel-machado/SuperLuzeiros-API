import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const deleteQuizUserUseCase = async (
  idQuiz: string,
  quizRepository: IQuizRepository, 
) => {

  const quiz = await quizRepository.delete(idQuiz);

  return {
    quiz
  };
}
