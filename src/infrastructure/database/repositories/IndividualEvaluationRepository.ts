import { IIndividualEvaluation, IndividualEvaluation } from '../models/IndividualEvaluation';

export interface IIndividualEvaluationRepository {
  createEvaluation(data: IIndividualEvaluation): Promise<IndividualEvaluation>;
  getEvaluationsByDbv(dbvId: string): Promise<IndividualEvaluation[]>;
  getEvaluationById(id: string): Promise<IndividualEvaluation | null>;
  updateEvaluation(id: string, data: IIndividualEvaluation): Promise<[number, IndividualEvaluation[]]>
}

export const IndividualEvaluationRepository = {
  
  // Criar Avaliação individual
  createEvaluation: async (data: IIndividualEvaluation): Promise<IndividualEvaluation> => {
    return await IndividualEvaluation.create(data);
  },

  // Obter avaliações de um desbravador
  getEvaluationsByDbv: async (dbvId: string): Promise<IndividualEvaluation[]> => {
    return await IndividualEvaluation.findAll({ where: { dbvId } })
  },

  // Obter uma avaliação por ID
  getEvaluationById: async (id: string): Promise<IndividualEvaluation | null> => {
    return await IndividualEvaluation.findByPk(id);
  },

    // Atualizar uma avaliação
    updateEvaluation: async (id: string, data: IIndividualEvaluation): Promise<[number, IndividualEvaluation[]]> => {
      return await IndividualEvaluation.update(data, { where: { id } });
    },

}
