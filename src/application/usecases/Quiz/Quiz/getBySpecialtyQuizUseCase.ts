import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const getBySpecialtyQuizUserUseCase = async (
  categorySpecialty: string,
  quizRepository: IQuizRepository, 
) => {

  const quiz = await quizRepository.findBySpecialty(categorySpecialty);

  return {
    quiz
  };
}
