
import { sequelize, User } from "../models";
import { Class } from "../models/Class";
import { IUserClass, UserClass } from "../models/ClassUser";


export interface IUserClassRepository {
  create(data: IUserClass): Promise<IUserClass>;
  update(id: string, data: Partial<IUserClass>): Promise<IUserClass>;
  delete(id: string): Promise<IUserClass>;

  findAll(): Promise<IUserClass[] | null>;
  findById(id: string): Promise<IUserClass | null>;
  findByUserAndClass(userId: string, classId: string): Promise<IUserClass | null>;  
  findAllByUser(userId: string): Promise<IUserClass[] | null>;
  findAllByClass(classId: string): Promise<IUserClass[] | null>;
}

export const UserClassRepository = {
  // Criar
  create: async (data: IUserClass): Promise<IUserClass> => {
    return await UserClass.create(data);
  },

  // Atualizar 
  update: async (id: string, data: Partial<IUserClass>): Promise<IUserClass> => {
    const classExisting = await UserClass.findByPk(id);
    if (!classExisting) throw new Error('Usuário com Classe não encontrada.');
    return await classExisting.update(data);
  },

  // Deletar 
  delete: async (id: string): Promise<any> => {
    const classExisting = await UserClass.findByPk(id);
    if (!classExisting) throw new Error('Usuário com Class não encontrada.');
    await classExisting.destroy();
  },

  // Todas as classes atribuidas
  findAll: async (): Promise<IUserClass[] | null> =>{
    return await UserClass.findAll({
      include: [
        { 
          model: User, 
          as: "classUser", 
          attributes: ["name"],
        },
        {
          model: Class,
          as: "classInfo",
          attributes: ["name"],
        },
      ],
    });
  },

  // Associação por ID
  findById: async (id: string): Promise<IUserClass | null> =>{
    return await UserClass.findOne({ where: { id } });
  },

  findByUserAndClass: async (userId: string, classId: string): Promise<IUserClass | null> => {
    return await UserClass.findOne({ where: { userId, classId } });
  },

  findAllByUser: async (userId: string): Promise<IUserClass[] | null> => {
    return await UserClass.findAll({ 
      where: { userId },
      include: [
        { 
          model: User, 
          as: "classUser",
          attributes: ["name"],
        },
        {
          model: Class,
          as: "classInfo",
          attributes: ["name"],
        },
      ],
    });
  },

  findAllByClass: async (classId: string): Promise<IUserClass[] | null> => {
    return await UserClass.findAll({ 
      where: { classId },
      include: [
        { 
          model: User, 
          as: "classUser",  // Alias definido no relacionamento
          attributes: ["name", "email", "role"],  // Campos que deseja pegar dos usuários
        },
        {
          model: Class,     // Modelo de Class
          as: "classInfo",  // Alias definido no relacionamento
          attributes: ["name"],  // Campos que deseja pegar das Class
        },
      ],
    
    });
  },
};
