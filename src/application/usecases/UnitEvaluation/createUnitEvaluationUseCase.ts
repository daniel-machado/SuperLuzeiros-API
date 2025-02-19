import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitEvaluation } from "../../../infrastructure/database/models/UnitEvaluation";
import { IUnitEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";
import { createRankingUseCase } from "../UnitRanking/createRankingUseCase";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { createEvaluationLogUseCase } from "./createEvaluationLoguseCase";
import { EvaluationLogRepository } from "../../../infrastructure/database/repositories/EvaluationLogRepository";

export const createUnitEvaluationUseCase = async (
  data: IUnitEvaluation,
  unitEvaluationRepository: IUnitEvaluationRepository, 
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository,
  unitRankingRepository: IUnitRankingRepository
) => {

  if (!data.evaluatedBy) {
    throw new Error("O campo 'evaluatedBy' é obrigatório.");
  }
  if (!data.unitId || !data.week) {
    throw new Error("unitId e week são obrigatórios para criar ou atualizar uma avaliação.");
  }

  const existingEvaluationForWeek = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(data.unitId, data.week);
  if (existingEvaluationForWeek) {
    throw new Error("Já existe uma avaliação para essa semana");
  }

  // Buscar respostas adicionais já existentes para essa semana
  const existingAnswers = await unitEvaluationAnswerRepository.findAllToWeek(
    data.unitId as string, 
    data.week as number
  );
  const additionalPoints = existingAnswers.reduce((sum, ans) => sum + (Number(ans.score) || 0), 0);

  // Somar os pontos da avaliação com os pontos adicionais, Certificando de que data.examScore é um número válido
  const examScore = Number(data.examScore);
  
  // Calcular totalScore (nota do exame + pontos adicionais)
  //const totalScore = (data.examScore ?? 0) + additionalPoints;
  const totalScore = (isNaN(examScore) ? 0 : examScore) + additionalPoints;


    // Se a avaliação não existe, criar uma nova
    const newEvaluation = await unitEvaluationRepository.createUnitEvaluation({
      ...data,
      totalScore,
    });

  await createRankingUseCase(
    data.unitId as string, 
    data.week as number, 
    data.correctAnswers as number,
    data.wrongAnswers as number,
    totalScore, 
    unitRankingRepository
  );

  await createEvaluationLogUseCase(
    data.unitId as string,
    data.evaluatedBy,
    'created',
    EvaluationLogRepository
  );

  return {
    newEvaluation,
  };
};
