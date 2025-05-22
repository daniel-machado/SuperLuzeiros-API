import { IUnitEvaluationAnswerRepository } from "../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository";
import { IUnitEvaluation } from "../../../infrastructure/database/models/UnitEvaluation";
import { IUnitEvaluationRepository } from "../../../infrastructure/database/repositories/UnitEvaluationRepository";
import { createEvaluationLogUseCase } from "./createEvaluationLoguseCase";
import { EvaluationLogRepository } from "../../../infrastructure/database/repositories/EvaluationLogRepository";
import { IUnitRankingRepository } from "../../../infrastructure/database/repositories/UnitRankingRepository";
import { updateUnitRankingUseCase } from "../UnitRanking/updateUnitRankingUseCase";

export const updateUnitEvaluationUseCase = async (
  id: string,
  data: Partial<IUnitEvaluation>,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository,
  unitRankingRepository: IUnitRankingRepository
) => {
  try {
    // Verifica se o objeto `data` tem pelo menos um campo a ser atualizado
    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum campo para atualização foi fornecido.");
    }

    // Buscar a avaliação existente para pegar `unitId` e `week`
    const existingEvaluation = await unitEvaluationRepository.getUnitEvaluationById(id);
    if (!existingEvaluation) {
      throw new Error("Avaliação não encontrada.");
    }
    
    // // Se `examScore` foi enviado, recalcular `totalScore`
    // if (data.examScore !== undefined) {
    //   const examScore = Number(data.examScore);
    //   const validExamScore = isNaN(examScore) || examScore < 0 ? 0 : examScore;

    //   // Buscar os pontos das respostas adicionais da semana da avaliação
    //   const answers = await unitEvaluationAnswerRepository.findAllToWeek(
    //     existingEvaluation.unitId as string,
    //     existingEvaluation.week as number
    //   );
      
    //   // Calcular os pontos adicionais com validação
    //   const additionalPoints = answers.reduce((sum, ans) => sum + (Number(ans.score) || 0), 0);
      
    //   // Atualizar o totalScore
    //   data.totalScore = validExamScore + additionalPoints;
    // } else if (data.totalScore === undefined) {
    //   // Se não for fornecido examScore, garantir que o totalScore seja mantido ou calculado
    //   const answers = await unitEvaluationAnswerRepository.findAllToWeek(
    //     existingEvaluation.unitId as string,
    //     existingEvaluation.week as number
    //   );
    //   const additionalPoints = answers.reduce((sum, ans) => sum + (Number(ans.score) || 0), 0);

    //   // Caso não tenha examScore, manter o totalScore apenas com as respostas adicionais
    //   data.totalScore = additionalPoints;
    // }

    // Atualizar a avaliação com os dados fornecidos
    const updatedEvaluation = await unitEvaluationRepository.updateUnitEvaluation(id, data);

    // // Atualizar o ranking
    await updateUnitRankingUseCase(
      updatedEvaluation.unitId as string,
      updatedEvaluation.week as number,
      updatedEvaluation.correctAnswers as number,
      updatedEvaluation.wrongAnswers as number,
      updatedEvaluation.totalScore as number,
      unitRankingRepository
    );

    await createEvaluationLogUseCase(
      updatedEvaluation.unitId as string,
      updatedEvaluation.evaluatedBy as string,
      'updated',
      EvaluationLogRepository
    );

    return updatedEvaluation;
  } catch (error: any) {
    throw new Error(`Erro ao atualizar avaliação: ${error.message}`);
  }
};
