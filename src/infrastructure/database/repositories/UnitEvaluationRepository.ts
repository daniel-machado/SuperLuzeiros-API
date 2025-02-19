import { Unit } from '../models';
import { IUnitEvaluation, UnitEvaluation } from '../models/UnitEvaluation';

export interface IUnitEvaluationRepository {
  createUnitEvaluation(data: IUnitEvaluation): Promise<UnitEvaluation>;
  updateUnitEvaluation(id: string, data: Partial<IUnitEvaluation>): Promise<any>;
  deleteUnitEvaluation(id: string): Promise<any>;
  getUnitEvaluationsByUnit(unitId: string): Promise<UnitEvaluation[]>;
  getUnitEvaluationsByAll(): Promise<UnitEvaluation[]>;
  getUnitEvaluationById(id: string): Promise<UnitEvaluation | null>;
  getUnitEvaluationByUnitAndWeek(unitId: string, week: number): Promise<IUnitEvaluation | null>;
  findActiveEvaluationByUnitId(unitId: string): Promise<UnitEvaluation | null>;
  findActiveEvaluationAll(): Promise<UnitEvaluation[] | null>;
}

export const UnitEvaluationRepository = {
  
  // Criar Avaliação individual
  createUnitEvaluation: async (data: IUnitEvaluation): Promise<UnitEvaluation> => {
    return await UnitEvaluation.create(data);
  },

  // Atualizar uma avaliação
  updateUnitEvaluation: async (id: string, data: Partial<IUnitEvaluation>): Promise<any> => {
    const evaluation = await UnitEvaluation.findByPk(id);
    if (!evaluation) throw new Error('Avaliação não encontrada.');
    return await evaluation.update(data);
  },

  getUnitEvaluationByUnitAndWeek: async (unitId: string, week: number): Promise<IUnitEvaluation | null>  => {
    return await UnitEvaluation.findOne({
      where: { unitId, week },
    });
  },

  // Deletar uma avaliação
  deleteUnitEvaluation: async (id: string): Promise<any> => {
    const evaluation = await UnitEvaluation.findByPk(id);
    if (!evaluation) throw new Error('Avaliação não encontrada.');
    await evaluation.destroy();
  },

  // Obter todas as avaliações de todas as unidades
  getUnitEvaluationsByAll: async (): Promise<UnitEvaluation[]> => {
    return await UnitEvaluation.findAll({
      include: [
        {
          model: Unit, // Relacionamento com a unidade
          as: "unit",  // Nome do alias definido no relacionamento
          attributes: ["id", "name"], // Busca o id e o nome da unidade
        },
      ],
      attributes: [
        "id",
        "week",
        "examScore",
        "correctAnswers",
        "wrongAnswers",
        "totalScore",
        "createdAt",
        "updatedAt",
        "status"
      ], 
    });
  },

  // Obter todas as avaliações de uma unidade
  getUnitEvaluationsByUnit: async (unitId: string): Promise<UnitEvaluation[]> => {
    return await UnitEvaluation.findAll(
    { where: { unitId } });
  },

  // Obter uma avaliação por ID
  getUnitEvaluationById: async (id: string): Promise<UnitEvaluation | null> => {
    return await UnitEvaluation.findByPk(id, {
      include: [
        {
          model: Unit, // Relacionamento com a unidade
          as: "unit",  // Nome do alias definido no relacionamento
          attributes: ["id", "name"], // Busca o id e o nome da unidade
        },
      ],
    });
  },

  findActiveEvaluationByUnitId: async (unitId: string): Promise<UnitEvaluation | null> => {
    return await UnitEvaluation.findOne({
      where: {
        unitId,
        status: "open", // Busca apenas avaliações abertas
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });
    //Buscar por datas ao inves de status
    // return await UnitEvaluation.findOne({
    //   where: {
    //     unitId,
    //     startDate: { [Op.lte]: new Date() }, // Iniciou antes ou exatamente agora
    //     endDate: { [Op.gte]: new Date() }, // Ainda não terminou
    //   },
    //   order: [["startDate", "DESC"]],
    // });
  },

  findActiveEvaluationAll: async (): Promise<UnitEvaluation[] | null> => {
    return await UnitEvaluation.findAll({
      where: {
        status: "open", // Busca apenas avaliações abertas
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });
  },


}
