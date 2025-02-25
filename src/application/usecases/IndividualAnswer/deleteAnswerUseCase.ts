import { IIndividualEvaluationRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IIndividualEvaluationAnswerRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationAnswerRepository';
import { updateTotalScoreIndividual } from '../updateTotalScoreIndividual';
import { IInidividualRankingRepository } from '../../../infrastructure/database/repositories/InidividualRankingRepository';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUnitEvaluationRepository } from '../../../infrastructure/database/repositories/UnitEvaluationRepository';
import { IUnitRankingRepository } from '../../../infrastructure/database/repositories/UnitRankingRepository';

export const deleteAnswerUseCase = async (
  id: string,
  individualEvaluationAnswerRepository: IIndividualEvaluationAnswerRepository,
  individualEvaluationRepository: IIndividualEvaluationRepository,
  individualRankingRepository: IInidividualRankingRepository,
  
  unitRepository: IUnitRepository,
  
  unitEvaluationRepository: IUnitEvaluationRepository,
  unitRankingRepository: IUnitRankingRepository
) => {
  const answer = await individualEvaluationAnswerRepository.findOne(id);
  if(answer){
    const evaluation = await individualEvaluationRepository.getEvaluationById(answer.individualEvaluationId);
    const totalUpdate = evaluation.totalScore - answer.score;
    await individualEvaluationRepository.updateEvaluation(evaluation.id, {
      totalScore: totalUpdate
    })
  
    const existingRanking = await individualRankingRepository.findByUserAndWeek(
      evaluation.userId as string, 
      evaluation.week as number
    );
  
    if (existingRanking) {
      existingRanking.totalScore = existingRanking.totalScore - answer.score
      await individualRankingRepository.updateRanking(existingRanking);
    }




    
    const unitUser = await unitRepository.getUnitByUser(evaluation.userId);
    if(!unitUser){
      throw new Error("Usuário sem unidade");
    }

    // Busca a avaliação que está relacionada a resposta
    const evaluationExisting = await unitEvaluationRepository.getUnitEvaluationByUnitAndWeek(unitUser.unitId, answer.week);
    if(!evaluationExisting){
      throw new Error("Avaliação da unidade não encontrada para atualizar o total dos pontos");
    }
    
    // Subtrai o totalScore da avaliação
    const totalUpdateEvaluation = Number(evaluationExisting.totalScore) - Number(answer.score)

    // Atualiza o totalScore da avaliação
    await unitEvaluationRepository.updateUnitEvaluation(evaluationExisting.id as string, {
      totalScore: totalUpdateEvaluation 
    });

    const existingUnitRanking = await unitRankingRepository.findByUnitAndWeek(
      unitUser.unitId as string, 
      answer.week
    );

    if (existingUnitRanking) {
      existingUnitRanking.totalScore = existingUnitRanking.totalScore - Number(answer.score)
      await unitRankingRepository.updateRanking(existingUnitRanking);
    }
  }
  
  return await individualEvaluationAnswerRepository.delete(id);

}

