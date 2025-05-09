import { IQuizAnswerRepository } from '../../../../infrastructure/database/repositories/QuizAnswerRepository';
import { IQuizUserAttempt } from '../../../../infrastructure/database/models/QuizUserAttempt'; 
import { IQuizUserAttemptRepository } from '../../../../infrastructure/database/repositories/QuizUserAttemptRepository';
import { StatusQuiz } from '../../../../infrastructure/ENUMS/StatusQuiz';
import { createQuizStatisticsUseCase } from '../QuizStatistics/createQuizStatisticsUseCase';
import { QuizStatisticsRepository } from '../../../../infrastructure/database/repositories/QuizStatisticsRepository';
import { IUserSpecialtyRepository } from '../../../../infrastructure/database/repositories/UserSpecialtyRepository';
import { IQuizRepository } from '../../../../infrastructure/database/repositories/QuizRepository';

export const createQuizAttemptUseCase = async (
  data: IQuizUserAttempt,
  answers: [],
  quizAttemptRepository: IQuizUserAttemptRepository,
  quizAnswerRepository: IQuizAnswerRepository,
  userSpecialtyRepository: IUserSpecialtyRepository,
  quizRepository: IQuizRepository
) => {

  // Obtém as tentativas do usuário e pega a última
  const attemptExisting = await quizAttemptRepository.findAttempts(data.userId, data.quizId);
  if (attemptExisting) {
    const lastAttemptDate = new Date(attemptExisting.lastAttempt as Date);
    const currentDate = new Date();
    
    const diffTime = currentDate.getTime() - lastAttemptDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Converte para dias inteiros

    const failedQuizzes = attemptExisting.failedQuizzes || 0;
    const blockDays = failedQuizzes >= 3 ? 10 : 3; // Definição do tempo de bloqueio

    // if (diffDays < blockDays) {
    //   throw new Error(`Você só pode refazer esse quiz após ${blockDays} dias.`);
    // }
  }
  if (!answers || answers.length === 0) {
    throw new Error("Nenhuma resposta foi enviada.");
  }
  
  // Obtém as perguntas respondidas
  const questionIds = answers.map((a: any) => a.questionId);
  if (!questionIds.length) {
    throw new Error("Erro ao obter perguntas do quiz.");
  }

  // Busca respostas corretas
  const correctAnswers = await quizAnswerRepository.findCorrectAnswers(questionIds);

  // Calcula a pontuação do usuário
  let score = 0;
  answers.forEach((userAnswer: any) => {
    const correct = correctAnswers.find(
      (ca: any) => ca.questionId === userAnswer.questionId && ca.id === userAnswer.answerId
    );
    if (correct) {
      score += 1; // Incrementa 1 ponto por resposta correta
    }
  });

  // Define quantas tentativas falhas o usuário tem
  const failedQuizzes = score >= 7 ? 0 : ((attemptExisting?.failedQuizzes || 0) + 1);

  // Cria a nova tentativa de quiz
  const { userId, quizId } = data;
  const newAttempt = await quizAttemptRepository.create({
    userId,
    quizId,
    score,
    status: (score >= 7 ? 'approved' : 'failed') as StatusQuiz,
    failedQuizzes,
    attemptDate: new Date(),
    failedAttempts: answers.length - score,
    lastAttempt: new Date(),
  });

  // Atualiza estatísticas do quiz
  createQuizStatisticsUseCase({ userId, quizId }, score, QuizStatisticsRepository);

  // Busca quiz e especialidade
  const quiz = await quizRepository.findById(quizId);
  if (!quiz) {
    throw new Error("Quiz não encontrado.");
  }

  // const userSpe = await userSpecialtyRepository.findByUserAndSpecialty(userId, quiz.specialtyId);
  // if (!userSpe) {
  //   await userSpecialtyRepository.create({userId, specialtyId: quiz.specialtyId});
  // }

  // // Atualiza se o usuário foi aprovado no quiz
  // if (userSpe) {
  //   await userSpecialtyRepository.update(userSpe.id as string, {
  //     isQuizApproved: score >= 7
  //   });
  // }
  const userSpe = await userSpecialtyRepository.findByUserAndSpecialty(userId, quiz.specialtyId);

  if (!userSpe) {
      // Cria o registro se não existir
      const newUserSpecialty = await userSpecialtyRepository.create({ userId, specialtyId: quiz.specialtyId });
      
      // Atualiza o campo isQuizApproved após a criação
      await userSpecialtyRepository.update(newUserSpecialty.id as string, {
          isQuizApproved: score >= 7
      });
  } else {
      // Atualiza o campo isQuizApproved se o registro já existir
      await userSpecialtyRepository.update(userSpe.id as string, {
          isQuizApproved: score >= 7
      });
  }
  
  return { newAttempt };
};
