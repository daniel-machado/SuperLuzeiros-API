
// application/useCases/QuizDetailedAttempt/createQuizDetailedAttemptUseCase.ts
import { IQuizUserDetailedAttempt } from '../../../infrastructure/database/models/QuizUserDetailedAttempt';
import { IQuizUserDetailedAttemptRepository } from '../../../infrastructure/database/repositories/QuizUserDetailedAttemptRepository';
import { IQuizRepository } from '../../../infrastructure/database/repositories/QuizRepository';
import { IQuizQuestionRepository } from '../../../infrastructure/database/repositories/QuizQuestionRepository';
import { IQuizAnswerRepository } from '../../../infrastructure/database/repositories/QuizAnswerRepository';
import { IQuizStatisticsRepository } from '../../../infrastructure/database/repositories/QuizStatisticsRepository';
import { IQuizUserAttempt } from '../../../infrastructure/database/models/QuizUserAttempt';
import { StatusQuiz } from '../../../infrastructure/ENUMS/StatusQuiz';

export const createQuizDetailedAttemptUseCase = async (
  attemptData: IQuizUserAttempt,
  userAnswers: Array<{ questionId: string; answerId: string }>,
  quizDetailedAttemptRepository: IQuizUserDetailedAttemptRepository,
  quizRepository: IQuizRepository,
  quizQuestionRepository: IQuizQuestionRepository,
  quizAnswerRepository: IQuizAnswerRepository,
  quizStatisticsRepository: IQuizStatisticsRepository
): Promise<IQuizUserDetailedAttempt> => {

  // 1. Obter detalhes do quiz
  const quiz = await quizRepository.findById(attemptData.quizId);
  if (!quiz) {
    throw new Error('Quiz não encontrado.');
  }

  // 2. Obter todas as perguntas do quiz
  const questions = await quizQuestionRepository.findAllByQuizId(attemptData.quizId);
  if (!questions || questions.length === 0) {
    throw new Error('Nenhuma pergunta encontrada para este quiz.');
  }

  // 3. Obter respostas corretas para todas as perguntas
  const questionIds = questions.map(q => q.id).filter((id): id is string => typeof id === 'string');
  const correctAnswers = await quizAnswerRepository.findCorrectAnswers(questionIds);

  // 4. Preparar detalhes das respostas do usuário
  const detailedUserAnswers = await Promise.all(
    userAnswers.map(async userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (!question) {
        throw new Error(`Pergunta com ID ${userAnswer.questionId} não encontrada.`);
      }

      // Obter a resposta do usuário
      const userAnswerRecord = await quizAnswerRepository.findById(userAnswer.answerId);
      if (!userAnswerRecord) {
        throw new Error(`Resposta com ID ${userAnswer.answerId} não encontrada.`);
      }

      // Obter a resposta correta para esta pergunta
      const correctAnswer = correctAnswers.find((ca: { questionId: string; id: string; answer: string }) => ca.questionId === userAnswer.questionId);

      return {
        questionId: userAnswer.questionId,
        questionText: question.question,
        userAnswerId: userAnswer.answerId,
        userAnswerText: userAnswerRecord.answer,
        isCorrect: correctAnswer ? userAnswer.answerId === correctAnswer.id : false,
        correctAnswerId: correctAnswer?.id,
        correctAnswerText: correctAnswer?.answer,
      };
    })
  );

  // 5. Obter estatísticas do quiz
  const stats = await quizStatisticsRepository.findByUserAndQuiz(attemptData.userId, attemptData.quizId);

  // 6. Criar o registro detalhado
  const detailedAttempt: IQuizUserDetailedAttempt = {
    userId: attemptData.userId,
    quizId: attemptData.quizId,
    attemptId: attemptData.id as string,
    score: attemptData.score ?? 0,
    totalQuestions: detailedUserAnswers.length,
    status: attemptData.status ?? StatusQuiz.PENDING,
    attemptDate: attemptData.attemptDate || new Date(),
    userAnswers: detailedUserAnswers,
    quizDetails: {
      id: quiz.id ?? (() => { throw new Error('Quiz ID está indefinido.'); })(),
      title: quiz.title,
      specialty: {
        id: quiz.specialtyId,
        name: (quiz as any).specialty?.name || '',
        category: (quiz as any).specialty?.category || '',
        emblem: (quiz as any).specialty?.emblem || '',
      },
    },
    summary: stats ? {
      totalAttempts: stats.attempts || 0,
      bestScore: stats.bestScore || 0,
      averageScore: stats.averageScore || 0,
    } : undefined,
  };

  return await quizDetailedAttemptRepository.create(detailedAttempt);
};


