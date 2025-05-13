import { Unit, UnitDbv, User } from '../models';
import { IIndividualEvaluation, IndividualEvaluation } from '../models/IndividualEvaluation';

export interface IIndividualEvaluationRepository {
  createEvaluation(data: IIndividualEvaluation): Promise<IndividualEvaluation>;
  updateEvaluation(id: string, data: Partial<IIndividualEvaluation>): Promise<any>;
  deleteEvaluation(id: string): Promise<any>;
  getEvaluationsByAll(): Promise<any>;
  getEvaluationById(id: string): Promise<any>;
  getEvaluationByUserAndWeek(userId: string, week: number): Promise<any>;
  findActiveEvaluationByUser(userId: string): Promise<any>;
  getEvaluationByUser(userId: string): Promise<any>;
  findActiveEvaluationAll(): Promise<any>;
  countEvaluatedDbvsByUnitAndWeek(unitId: string, week: number): Promise<any>;
}

export const IndividualEvaluationRepository = {
  
  // Criar Avaliação individual
  createEvaluation: async (data: IIndividualEvaluation): Promise<IndividualEvaluation> => {
    return await IndividualEvaluation.create(data);
  },

  // Atualizar uma avaliação
  updateEvaluation: async (id: string, data: Partial<IIndividualEvaluation>): Promise<any> => {
    const evaluation = await IndividualEvaluation.findByPk(id);
    if (!evaluation) throw new Error('Avaliação não encontrada.');
    return await evaluation.update(data);
  },

  // Deletar uma avaliação
  deleteEvaluation: async (id: string): Promise<any> => {
    const evaluation = await IndividualEvaluation.findByPk(id);
    if (!evaluation) throw new Error('Avaliação não encontrada.');
    await evaluation.destroy();
  },

  // Obter todas as avaliações de todas as unidades
  getEvaluationsByAll: async (): Promise<any> => {
    return await IndividualEvaluation.findAll({
      include: [
        {
          model: User, // Relacionamento com a unidade
          as: "usersEvaluation",  // Nome do alias definido no relacionamento
          attributes: ["id", "name", "photoUrl"], // Busca o id e o nome da unidade
        },
      ],
      // attributes: [
      //   "id",
      //   "week",
      //   "examScore",
      //   "correctAnswers",
      //   "wrongAnswers",
      //   "totalScore",
      //   "createdAt",
      //   "updatedAt",
      //   "status"
      // ], 
    });
  },

  // Obter uma avaliação por ID
  getEvaluationById: async (id: string): Promise<any> => {
    return await IndividualEvaluation.findOne({
      where:{ id },
      include: [
        {
          model: User, // Relacionamento com a unidade
          as: "usersEvaluation",  // Nome do alias definido no relacionamento
          attributes: ["id", "name", "photoUrl"], // Busca o id e o nome da unidade
        },
      ],
      
    });
  },

  
  getEvaluationByUser: async (userId: string): Promise<any> => {
    return await IndividualEvaluation.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "usersEvaluation",
          attributes: ["id", "name", "photoUrl"],
        }
      ],
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });
  },

  findActiveEvaluationByUser: async (userId: string): Promise<any> => {
    return await IndividualEvaluation.findOne({
      where: {
        userId,
        status: "open", // Busca apenas avaliações abertas
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });

    //Buscar por datas ao inves de status
    // return await UnitEvaluation.findOne({
    //   where: {
    //     ,
    //     startDate: { [Op.lte]: new Date() }, // Iniciou antes ou exatamente agora
    //     endDate: { [Op.gte]: new Date() }, // Ainda não terminou
    //   },
    //   order: [["startDate", "DESC"]],
    // });
  },
  
  getEvaluationByUserAndWeek: async (userId: string, week: number): Promise<IIndividualEvaluation | null>  => {
    return await IndividualEvaluation.findOne({
      where: { 
        userId, 
        week
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });
    },

  findActiveEvaluationAll: async (): Promise<any> => {
    return await IndividualEvaluation.findAll({
      where: {
        status: "open", // Busca apenas avaliações abertas
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });
  },
  countEvaluatedDbvsByUnitAndWeek: async (unitId: string, week: number): Promise<any> => {
    const dbvsInUnit = await UnitDbv.findAll({
      where: { unitId },
      attributes: ['userId']
    });
    const userIds = dbvsInUnit.map( d => d.userId);

    if(userIds.length === 0) return 0;

    //Contar quantos desses usuário têm avaliação naquela semana
    const count = await IndividualEvaluation.count({
      where: {
        userId: userIds,
        week
      }
    })
    return count;
  }
}
