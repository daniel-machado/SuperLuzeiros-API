// repositories/unit.repository.ts
import { Transaction } from 'sequelize';
import { Unit, IUnitAttributes  } from '../models/Unit'
import { User } from '../models/User'
import { UnitCounselor } from '../models/UnitCounselor';
import { UnitDbv } from '../models/UnitDbv';

export interface IUnitRepository {
  createUnit(name: string, photo?: string, transaction?: Transaction): Promise<any>;
  getAllUnits(): Promise<any>;
  getUnitById(idUnit: string): Promise<any>;
  updateUnit(unitId: string, name?: string, photo?: string): Promise<any>;
  deleteUnit(unitId: string): Promise<any>;
  addCounselorToUnit(unitId: string, userId: string): Promise<any>;

  existingCounselorUnitActual(unitId: string, userId: string): Promise<any>;
  existeOtherUnit(userId: string):Promise<any>;
  
  existingDBVUnitActual(unitId: string, userId: string): Promise<any>;
  existeDBVOtherUnit(userId: string):Promise<any>;

  addDbvToUnit(unitId: string, userId: string): Promise<any>;
  removeCounselorFromUnit(userId: string, unitId: string): Promise<any>;
  removeDbvFromUnit(userId: string, unitId: string): Promise<any>;

  getUnitByUser(userId: string): Promise<any>;
  countDbvsByUnitId(unitId: string): Promise<number>;
}

export const unitRepository = {
  // Criar uma nova unidade
  createUnit: async (name: string, photo?: string, transaction?: Transaction): Promise<any> => {
  return await Unit.create({ name, photo }, { transaction });
},

  // Buscar todas as unidade
  getAllUnits: async (): Promise<any> => {
    return await Unit.findAll({
      //attributes: ["id", "name"], // Seleciona os atributos da unidade
      include: [
        { 
          model: UnitCounselor, 
          as: "counselors", 
          include: [
            {
              model: User,
              as: "counselor", // Nome do alias definido no relacionamento
              attributes: ["id", "name", "photoUrl"], // Busca o nome e o id do User associado
            },
          ],
          attributes: ["id"]
        },
        { 
          model: UnitDbv, 
          as: "dbvs",
          include: [
            {
              model: User,
              as: "dbv", // Se UnitDbv também se relaciona com User
              attributes: ["id", "name", "photoUrl"], 
            },
          ],
          attributes: ["id"]
        },
      ],
    });
  },
  
  // Buscar unidade por ID
  getUnitById: async (idUnit: string): Promise<any> => {
    return await Unit.findByPk(idUnit, {
      include: [
        { 
          model: UnitCounselor, 
          as: "counselors", 
          include: [
            {
              model: User,
              as: "counselor", // Nome do alias definido no relacionamento
              attributes: ["id", "name"], // Busca o nome e o id do User associado
            },
          ],
          attributes: ["id"]
        },
        { 
          model: UnitDbv, 
          as: "dbvs",
          include: [
            {
              model: User,
              as: "dbv", // Se UnitDbv também se relaciona com User
              attributes: ["id", "name"], 
            },
          ],
          attributes: ["id"]
        },
      ],
    });
  },
  

  // Atualizar Unidade
  updateUnit: async (unitId: string, name?: string, photo?: string): Promise<any> => {
    const unit = await Unit.findByPk(unitId);
    if (!unit) return null;
    return await unit.update({ name, photo });
  },

  // Deletar Unidade
  deleteUnit: async (unitId: string): Promise<any> => {
    return await Unit.destroy({ where: { id: unitId } });
  },

  // Adicionar conselheiro a uma unidade
  addCounselorToUnit: async (unitId: string, userId: string): Promise<any> => {
    return await UnitCounselor.create({ unitId, userId });
  },

  // Verifica se o usuário já é conselheiro da unida passada
  existingCounselorUnitActual: async(unitId: string, userId: string): Promise<any> => {
    const existingCounselor = await UnitCounselor.findOne({
      where: { unitId, userId },
    });
    return existingCounselor
  },

 // Verificar se já está em outra unidade
  existeOtherUnit: async(userId: string):Promise<any> => {
    const existing = await UnitCounselor.findOne({ 
      where: { userId } 
    });
    return existing;
  },

    // Verifica se o usuário já é dbv da unidade passada
    existingDBVUnitActual: async(unitId: string, userId: string): Promise<any> => {
      const existingDbv = await UnitDbv.findOne({
        where: { 
          unitId: String(unitId), 
          userId: String(userId) 
        },
      });
      return existingDbv
    },
  
    // Verificar se já está em outra unidade
    existeDBVOtherUnit: async(userId: string):Promise<any> => {
      const existing = await UnitDbv.findOne({ 
        where: { userId } 
      });
      return existing;
    },

  // 🔹 Buscar a unidade associada ao usuário
  getUnitByUser: async (userId: string): Promise<any> => {
    return await UnitDbv.findOne({
      where: { userId },
    });
  },

  // Adicionar desbravador a uma unidade
  addDbvToUnit: async (unitId: string, userId: string): Promise<any> => {
    return await UnitDbv.create({ unitId, userId });
  },

  // Remover conselheiro de uma unidade
  removeCounselorFromUnit: async (unitId: string, userId: string): Promise<any> => {
    return await UnitCounselor.destroy({ where: { unitId, userId } });
  },

  // Remover desbravador de uma unidade
  removeDbvFromUnit: async (unitId: string, userId: string): Promise<any> => {
    try {
      //console.log("Tentando remover DBV:", { unitId, userId });
      const result = await UnitDbv.destroy({ where: { unitId, userId } });
      //console.log("Resultado do destroy:", result);
      return result;
    } catch (error) {
      console.log("Erro ao remover DBV:", error);
      throw error;
    }
  },

  countDbvsByUnitId: async(unitId: string): Promise<number> => {
    return await UnitDbv.count({
      where: {
        unitId,
      }
    })
  }

}
