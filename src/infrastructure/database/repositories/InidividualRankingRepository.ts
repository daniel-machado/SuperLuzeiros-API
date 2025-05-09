import { Unit, User } from '../models';
import { IIndividualRanking, IndividualRanking } from '../models/IndividualRanking';
import { sequelize } from '../models';

export interface IInidividualRankingRepository {
  findByUserAndWeek(unitId: string, week: number): Promise<IndividualRanking | null>;
  findByUser(unitId: string): Promise<any>;
  createRanking(data: IIndividualRanking): Promise<IndividualRanking>;
  updateRanking(data: IIndividualRanking): Promise<void>;
  getRankingByWeek(week: number): Promise<any>;
  getRanking(): Promise<any>;
  removeRanking(id: string): Promise<any>;
}

export const IndividualRankingRepository  = {
  
  findByUserAndWeek: async (dbvId: string, week: number): Promise<IndividualRanking | null> => {
    const ranking = await IndividualRanking.findOne({
      where: { dbvId, week }
    });
    return ranking;
  },

  findByUser: async (dbvId: string): Promise<any> => {
    const ranking = await IndividualRanking.findAll({
      where: { dbvId }
    });
    return ranking;
  },
  
  createRanking: async (data: IIndividualRanking): Promise<IndividualRanking> => {
    return await IndividualRanking.create(data);
  },

  updateRanking: async (data: IIndividualRanking): Promise<void> => {
    await IndividualRanking.update(
      {
        totalScore: data.totalScore,
      },
      { where: { dbvId: data.dbvId, week: data.week } }
    );
  },

  getRankingByWeek: async (week: number): Promise<any> => {
    return await IndividualRanking.findAll({
      where: { week },
      include: [
        {
          model: User,
          as: 'individualRank',
          attributes: ["name", "photoUrl"]
        } 
      ],
      order: [["totalScore", "DESC"]], // Ordenando do maior para o menor
    });
    
  },

  getRanking: async (): Promise<any> => {
    return await IndividualRanking.findAll({
      include: [
        {
          model: User,
          as: 'individualRank',  // Usando um alias diferente para a tabela users
          attributes: ["name", "photoUrl"],  // Exibindo nome do dbv
        },
      ],
      attributes: [
        "dbvId",  // ID do dbv
        [sequelize.fn("SUM", sequelize.col("individualRanking.totalScore")), "totalScore"],
      ],
      group: ["dbvId", "individualRank.id", "individualRank.name"],  // Usando o alias correto
      order: [[sequelize.literal("\"totalScore\""), "DESC"]],
    }); 
  },
  

  removeRanking: async (id: string): Promise<any> => {
    const evaluation = await IndividualRanking.findByPk(id);
    if (!evaluation) throw new Error('Ranking não encontrado.');
    await evaluation.destroy();
  }
}
