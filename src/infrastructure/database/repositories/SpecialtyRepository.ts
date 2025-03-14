
import { Specialty, ISpecialty } from "../models/Specialty";

export interface ISpecialtyRepository {
  create(data: ISpecialty): Promise<ISpecialty>;

  findAll(): Promise<ISpecialty[] | null>;
  findById(id: string): Promise<ISpecialty | null>;
  findByCategory(categorySpecialty: string): Promise<ISpecialty[] | null>;
  findByLevel(level: number): Promise<ISpecialty[] | null>;
  
  update(id: string, data: Partial<ISpecialty>): Promise<ISpecialty>;
  delete(id: string): Promise<ISpecialty>;
}

export const SpecialtyRepository = {
  // Criar ums especialidade
  create: async (data: ISpecialty): Promise<ISpecialty> => {
    return await Specialty.create(data);
  },

  // TOdas as especialidades
  findAll: async (): Promise<ISpecialty[] | null> =>{
    return await Specialty.findAll();
  },

  // Especialidades pelo ID
  findById: async (id: string): Promise<ISpecialty | null> =>{
    return await Specialty.findOne({ where: { id } });
  },

  // Especialidades pela categoria
  findByCategory: async (categorySpecialty: string): Promise<ISpecialty[] | null> =>{
    return await Specialty.findAll({ where: { category: categorySpecialty } });
  },

  // Especialidades pelo nível
  findByLevel: async (level: number): Promise<ISpecialty[] | null> =>{
    return await Specialty.findAll({ where: { levelSpe: level } });
  },

  // Atualizar especialidade
  update: async (id: string, data: Partial<ISpecialty>): Promise<ISpecialty> => {
    const specialty = await Specialty.findByPk(id);
    if (!specialty) throw new Error('Especialidade não encontrada.');
    return await specialty.update(data);
  },

  // Deletar Especialidade
  delete: async (id: string): Promise<any> => {
    const specialty = await Specialty.findByPk(id);
    if (!specialty) throw new Error('Especialidade não encontrada.');
    await specialty.destroy();
  },
};
