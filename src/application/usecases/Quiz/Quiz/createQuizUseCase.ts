import { IQuiz } from "../../../../infrastructure/database/models/Quiz";
import { IQuizRepository } from "../../../../infrastructure/database/repositories/QuizRepository";

export const createQuizUserUseCase = async (
  data: IQuiz,
  quizRepository: IQuizRepository, 
) => {

  const existingQuiz = await quizRepository.findBySpecialty(data.specialtyId);
  if (existingQuiz && existingQuiz.length > 0) throw new Error("Já existe um Quiz para essa especialidade");

  const newQuiz = await quizRepository.create(data);

  return {
    newQuiz
  };
}
