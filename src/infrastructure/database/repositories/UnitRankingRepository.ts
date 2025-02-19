import { Unit } from '../models';
import { IUnitRanking, UnitRanking } from '../models/UnitRanking';
import { sequelize } from '../models';

export interface IUnitRankingRepository {
  findByUnitAndWeek(unitId: string, week: number): Promise<IUnitRanking | null>;
  findByUnit(unitId: string): Promise<any>;
  createRanking(data: IUnitRanking): Promise<IUnitRanking>;
  updateRanking(data: IUnitRanking): Promise<void>;
  getRankingByWeek(week: number): Promise<any>;
  getRanking(): Promise<any>;
  removeRanking(id: string): Promise<any>;
}

export const UnitRankingRepository  = {
  
  findByUnitAndWeek: async (unitId: string, week: number): Promise<IUnitRanking | null> => {
    const ranking = await UnitRanking.findOne({
      where: { unitId, week }
    });
    return ranking ? ranking.get({ plain: true }) : null;
  },

  findByUnit: async (unitId: string): Promise<any> => {
    const ranking = await UnitRanking.findAll({
      where: { unitId }
    });
    return ranking;
  },
  
  createRanking: async (data: IUnitRanking): Promise<IUnitRanking> => {
    return await UnitRanking.create(data);
  },

  updateRanking: async (data: IUnitRanking): Promise<void> => {
    await UnitRanking.update(
      {
        totalScore: data.totalScore,
        wrongAnswers: data.wrongAnswers,
        correctAnswers: data.correctAnswers,
      },
      { where: { unitId: data.unitId, week: data.week } }
    );
  },

  getRankingByWeek: async (week: number): Promise<any> => {
    return await UnitRanking.findAll({
      where: { week },
      include: [
        {
          model: Unit,
          as: 'unitRank',
          attributes: ["name"]
        } 
      ],
      order: [["totalScore", "DESC"]], // Ordenando do maior para o menor
    });
    
  },

  getRanking: async (): Promise<any> => {
    return await UnitRanking.findAll({
      include: [
        {
          model: Unit,
          as: 'unitRank',
          attributes: ["name"]
        } 
      ],
      attributes: [
        "unitId",
        [sequelize.fn("SUM", sequelize.col("UnitRanking.totalScore")), "totalScore"],
        [sequelize.fn("SUM", sequelize.col("UnitRanking.correctAnswers")), "correctAnswers"],
        [sequelize.fn("SUM", sequelize.col("UnitRanking.wrongAnswers")), "wrongAnswers"],
      ],
      
      group: ["unitId", "unitRank.id", "unitRank.name"], 
      order: [[sequelize.literal("\"totalScore\""), "DESC"]],
    }); 
  },

  removeRanking: async (id: string): Promise<any> => {
    const evaluation = await UnitRanking.findByPk(id);
    if (!evaluation) throw new Error('Ranking não encontrado.');
    await evaluation.destroy();
  }
}
