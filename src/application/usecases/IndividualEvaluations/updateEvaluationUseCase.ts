import { IUnitEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";
import { IUnitEvaluation } from "../../../infrastructure/database/models/UnitEvaluation";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { EvaluationLogRepository } from "../../../infrastructure/database/repositories/EvaluationLogRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { updateUnitRankingUseCase } from "../UnitRanking/updateUnitRankingUseCase";

import { IIndividualEvaluation } from '../../../infrastructure/database/models/IndividualEvaluation'
import { IIndividualEvaluationRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationRepository";
import { IIndividualEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository";
import { IInidividualRankingRepository } from "../../../infrastructure/database/repositories/InidividualRankingRepository";
import { updateIndividualRankingUseCase } from "../IndividualRanking/updateIndividualRankingUseCase";


export const updateEvaluationUseCase = async (
  id: string,
  data: Partial<IIndividualEvaluation>,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  inidividualRankingRepository: IInidividualRankingRepository
) => {
  try {
    // Verifica se o objeto `data` tem pelo menos um campo a ser atualizado
    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum campo para atualização foi fornecido.");
    }

    // Buscar a avaliação existente para pegar `unitId` e `week`
    const existingEvaluation = await individualEvaluationRepository.getEvaluationById(id);
    if (!existingEvaluation) {
      throw new Error("Avaliação não encontrada.");
    }

    // // Buscar os pontos das respostas adicionais da semana da avaliação
    // const answers = await individualEvaluationAnswerRepository.findAllToWeek(
    //   existingEvaluation.userId as string,
    //   existingEvaluation.week as number
    // );
    //  // Calcular os pontos adicionais com validação
    // const additionalPoints = answers.reduce((sum, ans) => sum + (Number(ans.score) || 0), 0);
    //  // Atualizar o totalScore
    // data.totalScore = additionalPoints;
    
    // Atualizar a avaliação com os dados fornecidos
    const updatedEvaluation = await individualEvaluationRepository.updateEvaluation(id, data);

    // // // Atualizar o ranking
    // await updateIndividualRankingUseCase(
    //   updatedEvaluation.userId as string,
    //   updatedEvaluation.week as number,
    //   updatedEvaluation.totalScore as number,
    //   inidividualRankingRepository
    // );

    return updatedEvaluation;
  } catch (error: any) {
    throw new Error(`Erro ao atualizar avaliação: ${error.message}`);
  }
};
