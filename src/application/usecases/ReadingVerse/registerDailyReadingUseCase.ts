

import { IndividualEvaluationRepository } from '../../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { IDailyVerseReading } from '../../../infrastructure/database/models/dailyVerseReading';
import { IDailyVerseReadingRepository } from '../../../infrastructure/database/repositories/DailyVerseRepository';
import Decimal from 'decimal.js';
import { IndividualRankingRepository } from '../../../infrastructure/database/repositories/InidividualRankingRepository';
import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository';


/**
 * UseCase para registrar uma leitura diária e atualizar o streak do usuário
 *
 * @param data Dados da leitura diária
 * @param repository Repositório de leituras diárias
 * @returns Objeto com o novo registro de leitura e informações sobre o streak
 */
export const registerDailyReadingUseCase = async (
  data: IDailyVerseReading,
  repository: IDailyVerseReadingRepository,
) => {

  const user = await UserRepository.findUserById(data.userId)
  if(!user){
    throw new Error('Usuário não encontrado');
  }
  // Normaliza a data para o inicio do dia.
  const normalizedDate = new Date(data.date);
  normalizedDate.setHours(0, 0, 0, 0);
  data.date = normalizedDate;
  
  // Verificar se já existe um registro para esta data e usuário
  const existingReading = await repository.findByUserIdAndDate(data.userId, data.date);

  if (existingReading) {
    throw new Error('Já existe um registro de leitura para esta data.');
  }


  // Obter o registro de leitura mais recente do usuário
  const latestReading = await repository.findLatestByUserId(data.userId);

  // Calcular se a leitura é consecutiva
  const today = new Date(data.date);
  today.setHours(0, 0, 0, 0);
  
  let streak = 1; // Começa com 1 para o dia atual
  let life = latestReading?.life || 0;


  if (latestReading) {
    const latestDate = new Date(latestReading.date);
    latestDate.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0) //Normalize yestarday as well
   
    // Compara as datas normalizadas
    const isYesterday = latestDate.getTime() === yesterday.getTime();
    const isToday = latestDate.getTime() === today.getTime();


    if (isToday) {
      // Já registrou hoje, não deveria acontecer (já tratado acima)
      throw new Error('Já existe um registro de leitura para esta data.');
    } else if (isYesterday) {
      // A última leitura foi ontem, incrementa o streak
      streak = latestReading.streak + 1;
    } else {
      // Verificar se possui vida para recuperar o streak
      if (latestReading.life > 0) {
        // Calcular quantos dias se passaram desde a última leitura
        const daysDifference = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
       
        // Se a diferença for menor ou igual ao número de vidas, usa as vidas para manter o streak
        if (daysDifference <= latestReading.life) {
          streak = latestReading.streak + 1;
          life = latestReading.life - daysDifference; // Deduz as vidas usadas
        } else {
          // Passou mais dias do que tem vidas, streak recomeça
          streak = 1;
          life = latestReading.life; // Mantém as vidas que tinha
        }
      } else {
        // Sem vidas, streak recomeça
        streak = 1;
      }
    }
  }


  // Verificar se atingiu algum milestone para ganhar vida
  const milestones = [1, 5, 10, 30, 50, 70, 100]; // Dias para ganhar uma vida
 
  // Se o streak atual está em um dos milestones, adiciona uma vida
  if (milestones.includes(streak) && !milestones.includes(streak - 1)) {
    life += 1;
  }







  // ######################## Adicionar pontos ############################

  if( user.role === 'dbv' ){
    // Buscar avaliação individual ativa
    const dbvEvaluation = await IndividualEvaluationRepository.findActiveEvaluationByUser(data.userId);
    if (!dbvEvaluation) throw new Error("Não há avaliação ativa para esse desbravador, Fale com o seu conselheiro.");

    const updatedIndividualTotal = new Decimal(dbvEvaluation.totalScore || 0).plus(data.pointsEarned);

    await IndividualEvaluationRepository.updateEvaluation(dbvEvaluation.id, {
      totalScore: updatedIndividualTotal.toNumber(),
    });

    // Atualizar ranking individual
    const existingRankingIndividual = await IndividualRankingRepository.findByUserAndWeek(data.userId, dbvEvaluation.week);
    if (existingRankingIndividual) {
      existingRankingIndividual.totalScore = updatedIndividualTotal.toNumber();
      await IndividualRankingRepository.updateRanking(existingRankingIndividual);
    }
  }
  


  // Criar o registro com o streak calculado
  const newReading = await repository.create({
    ...data,
    streak,
    life,
    readAt: new Date() // Data e hora atual para o readAt
  });


  // Retornar os dados criados junto com as informações de streak
  return {
    newReading,
    streakInfo: {
      currentStreak: streak,
      lives: life,
      hasReadToday: true, // Acabou de ler, então tem leitura hoje
      streakActive: true, // O streak está ativo quando há leitura no dia atual
      milestoneReached: milestones.includes(streak) ? streak : null
    }
  };
};


