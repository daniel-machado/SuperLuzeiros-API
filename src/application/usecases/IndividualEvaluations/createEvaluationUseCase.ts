import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { IUnitEvaluation } from "../../../infrastructure/database/models/UnitEvaluation";
import { IUnitEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";
import { createRankingUseCase } from "../UnitRanking/createRankingUseCase";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { EvaluationLogRepository } from "../../../infrastructure/database/repositories/EvaluationLogRepository";

import { IIndividualEvaluation } from '../../../infrastructure/database/models/IndividualEvaluation'
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IIndividualEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { createIndividualRankingUseCase } from "../IndividualRanking/CreateIndividualRankingUseCase";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";


export const createEvaluationUseCase = async (
  data: IIndividualEvaluation,
  individualEvaluationRepository: IIndividualEvaluationRepository, 
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualRankingRepository: IInidividualRankingRepository,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRepository: IUnitRepository,
) => {

  if (!data.userId || !data.week) {
    throw new Error("unitId e week são obrigatórios para criar ou atualizar uma avaliação.");
  }

  const unitExisting = await unitRepository.getUnitByUser(data.userId);
  if(!unitExisting){
    throw new Error("Desbravador sem unidade");
  }

  const existingEvaluationUnit = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(
    unitExisting.unitId, 
    data.week
  );
  if (!existingEvaluationUnit) {
    throw new Error("Não existe avaliação ativa da unidade ainda");
  }

  const existingEvaluationForWeek = await individualEvaluationRepository.getEvaluationByUserAndWeek(
    data.userId, 
    data.week
  );
  if (existingEvaluationForWeek) {
    throw new Error("Já existe uma avaliação individual para essa semana");
  }

  // Buscar respostas adicionais já existentes para essa semana
  const existingAnswers = await individualEvaluationAnswerRepository.findAllToWeek(
    data.userId as string, 
    data.week as number
  );
  const additionalPoints = existingAnswers.reduce((sum, ans) => sum + (Number(ans.score) || 0), 0);
  const totalScore = additionalPoints


    // Cria uma nova avaliação
    const newEvaluation = await individualEvaluationRepository.createEvaluation({
      ...data,
      totalScore,
    });

  await createIndividualRankingUseCase(
    data.userId as string, 
    data.week as number, 
    totalScore, 
    individualRankingRepository
  );

  return {
    newEvaluation,
  };
};
