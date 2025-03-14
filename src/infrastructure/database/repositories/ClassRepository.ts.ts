import { IClass, Class } from "../models/Class";


export interface IClassRepository {
  create(data: IClass): Promise<IClass>;

  findAll(): Promise<IClass[] | null>;
  findById(id: string): Promise<IClass | null>;
  findByType(typeClass: string): Promise<IClass[] | null>;
  
  update(id: string, data: Partial<IClass>): Promise<IClass>;
  delete(id: string): Promise<IClass>;
}

export const ClassRepository = {
  // Criar ums classe
  create: async (data: IClass): Promise<IClass> => {
    return await Class.create(data);
  },

  // TOdas as classes
  findAll: async (): Promise<IClass[] | null> =>{
    return await Class.findAll();
  },

  // classe pelo ID
  findById: async (id: string): Promise<IClass | null> =>{
    return await Class.findOne({ where: { id } });
  },

  // Classe pelo type
  findByType: async (typeClass: string): Promise<IClass[] | null> =>{
    return await Class.findAll({ where: { type: typeClass } });
  },

  // Atualizar class
  update: async (id: string, data: Partial<IClass>): Promise<IClass> => {
    const classExisting = await Class.findByPk(id);
    if (!classExisting) throw new Error('Classe não encontrada.');
    return await classExisting.update(data);
  },

  // Deletar Class
  delete: async (id: string): Promise<any> => {
    const classExisting = await Class.findByPk(id);
    if (!classExisting) throw new Error('Classe não encontrada.');
    await classExisting.destroy();
  },
};
