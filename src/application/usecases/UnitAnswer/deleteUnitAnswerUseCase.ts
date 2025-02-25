import { IUnitEvaluationRepository } from '../../../infrastructure/database/repositories/UnitEvaluationRepository';
import { IUnitEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/UnitEvaluationAnswerRepository';
import { IUnitRankingRepository } from '../../../infrastructure/database/repositories/UnitRankingRepository';
import { updateTotalScore } from '../updateTotalScore';

export const deleteUnitAnswerUseCase = async (
  id: string,
  unitEvaluationAnswerRepository: IUnitEvaluationAnswerRepository,
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository
) => {
  // Busca a resposta por ID
  const answerExisting = await unitEvaluationAnswerRepository.findById(id);
  if(answerExisting){
    
    // Busca a avaliação que está relacionada a resposta
    const evaluationExisting = await unitEvaluationRepository.getUnitEvaluationById(answerExisting.unitEvaluationId);
    if(evaluationExisting){
      // Subtrai o totalScore da avaliação
      const totalUpdateEvaluation = evaluationExisting.totalScore - Number(answerExisting.score)

      // Atualiza o totalScore da avaliação
      await unitEvaluationRepository.updateUnitEvaluation(evaluationExisting.id as string, {
        totalScore: totalUpdateEvaluation 
      });
    }

    const existingRanking = await unitRankingRepository.findByUnitAndWeek(
      answerExisting.unitId as string, 
      answerExisting.week
    );

    if (existingRanking) {
      existingRanking.totalScore = existingRanking.totalScore - Number(answerExisting.score)
      await unitRankingRepository.updateRanking(existingRanking);
    }
  }

  return await unitEvaluationAnswerRepository.delete(id);
  
}

