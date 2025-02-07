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
  addDbvToUnit(unitId: string, userId: string): Promise<any>;
  removeCounselorFromUnit(userId: string): Promise<any>;
  removeDbvFromUnit(userId: string): Promise<any>;
}

export const unitRepository = {
  // Criar uma nova unidade
  createUnit: async (name: string, photo?: string, transaction?: Transaction): Promise<any> => {
  return await Unit.create({ name, photo }, { transaction });
},

  // Buscar todas as unidade
  getAllUnits: async (): Promise<any> => {
    return await Unit.findAll();
    // return await Unit.findAll({
    //   include: [
    //     { model: UnitCounselor, as: 'counselors' },
    //     { model: UnitDbv, as: 'dbvs' },
    //   ],
    // });
  },

  // Buscar unidade por ID
  getUnitById: async (idUnit: string): Promise<any> => {
    return await Unit.findByPk(idUnit)
    // return await Unit.findByPk(idUnit, {
    //   include: [
    //     { model: UnitCounselor, as: 'counselors' },
    //     { model: UnitDbv, as: 'dbvs' },
    //   ],
    // });
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
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'counselor') {
      throw new Error('Usuário não é um conselheiro válido');
    }

    // Verificar se já está em outra unidade
    const existing = await UnitCounselor.findOne({ where: { userId } });
    if (existing) {
      throw new Error('Usuário já está em outra unidade');
    }

    return await UnitCounselor.create({ unitId, userId });
  },

  // Adicionar desbravador a uma unidade
  addDbvToUnit: async (unitId: string, userId: string): Promise<any> => {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'dbv') {
      throw new Error('Usuário não é um desbravador válido');
    }

    // Verificar se já está em outra unidade
    const existing = await UnitDbv.findOne({ where: { userId } });
    if (existing) {
      throw new Error('Usuário já está em outra unidade');
    }

    return await UnitDbv.create({ unitId, userId });
  },

  // Remover conselheiro de uma unidade
  removeCounselorFromUnit: async (userId: string): Promise<any> => {
    return await UnitCounselor.destroy({ where: { userId } });
  },

  // Remover desbravador de uma unidade
  removeDbvFromUnit: async (userId: string): Promise<any> => {
    return await UnitDbv.destroy({ where: { userId } });
  }

}
