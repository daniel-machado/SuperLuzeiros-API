import { StatusSpecialty } from "../../ENUMS/StatusSpecialty";
import { sequelize, User } from "../models";
import { Specialty } from "../models/Specialty";
import { IUserSpecialty, UserSpecialty } from "../models/UserSpecialty";


export interface IUserSpecialtyRepository {
  create(data: IUserSpecialty): Promise<IUserSpecialty>;
  update(id: string, data: Partial<IUserSpecialty>): Promise<IUserSpecialty>;
  delete(id: string): Promise<IUserSpecialty>;

  findAll(): Promise<IUserSpecialty[] | null>;
  findById(id: string): Promise<IUserSpecialty | null>;
  findByUserAndSpecialty(userId: string, specialtyId: string): Promise<IUserSpecialty | null>;  
  findAllByUser(userId: string): Promise<IUserSpecialty[] | null>;
  findAllBySpecialty(specialtyId: string): Promise<IUserSpecialty[] | null>;
  sendReportUser(userId: string, specialtyId: string, report: string): Promise<IUserSpecialty | null>;
  approveReport(userId: string, specialtyId: string, approverRole: string, comments: string): Promise<IUserSpecialty | null>;
  rejectReport(userId: string, specialtyId: string, approverRole: string, comments: string): Promise<IUserSpecialty | null>;
}

export const UserSpecialtyRepository = {
  // Criar
  create: async (data: IUserSpecialty): Promise<IUserSpecialty> => {
    return await UserSpecialty.create(data);
  },

  // Atualizar tentativa
  update: async (id: string, data: Partial<IUserSpecialty>): Promise<IUserSpecialty> => {
    const Specialty = await UserSpecialty.findByPk(id);
    if (!Specialty) throw new Error('Usuário com Especialidade não encontrada.');
    return await Specialty.update(data);
  },

  // Deletar tentativa
  delete: async (id: string): Promise<any> => {
    const Specialty = await UserSpecialty.findByPk(id);
    if (!Specialty) throw new Error('Usuário com Especialidade não encontrada.');
    await Specialty.destroy();
  },

  // Todas as tentativa
  findAll: async (): Promise<UserSpecialty[] | null> =>{
    return await UserSpecialty.findAll({
      include: [
        { 
          model: User, 
          as: "specialtyUser", 
          attributes: ["name"],
        },
      ],
    });
  },

  // tentativa por ID
  findById: async (id: string): Promise<UserSpecialty | null> =>{
    return await UserSpecialty.findOne({ where: { id } });
  },

  findByUserAndSpecialty: async (userId: string, specialtyId: string): Promise<IUserSpecialty | null> => {
    return await UserSpecialty.findOne({ where: { userId, specialtyId } });
  },

  findAllByUser: async (userId: string): Promise<IUserSpecialty[] | null> => {
    return await UserSpecialty.findAll({ 
      where: { userId },
      include: [
        { 
          model: User, 
          as: "specialtyUser",
          attributes: ["name"],
        },
        {
          model: Specialty,
          as: "specialtyInfo",
          attributes: ["name"],
        },
      ],
    });
  },

  findAllBySpecialty: async (specialtyId: string): Promise<IUserSpecialty[] | null> => {
    return await UserSpecialty.findAll({ 
      where: { specialtyId },
      include: [
        { 
          model: User, 
          as: "specialtyUser",  // Alias definido no relacionamento
          attributes: ["name", "email", "role"],  // Campos que deseja pegar dos usuários
        },
        {
          model: Specialty,     // Modelo de Specialties
          as: "specialtyInfo",  // Alias definido no relacionamento
          attributes: ["name"],  // Campos que deseja pegar das especialidades
        },
      ],
    
    });
  },

  sendReportUser: async (userId: string, specialtyId: string, report: string): Promise<any> => {
    return await UserSpecialty.update(
      { 
        report: sequelize.fn(
          'jsonb_set', 
          sequelize.col('report'), 
          '{999999}',  // Adiciona ao final do array
          sequelize.literal(`'${JSON.stringify(report)}'::jsonb`),
          true
        ),
        approvalStatus: 'waiting_by_counselor' as StatusSpecialty
      },
      { where: { userId, specialtyId }}
    );
  },

  approveReport: async (userId: string, specialtyId: string, approverRole: string, comments: string): Promise<any> => {
    const updates: any = {};
    if (approverRole === 'counselor') {
      updates.counselorApproval = true;
      updates.counselorApprovalAt = new Date();
      updates.approvalStatus = 'waiting_by_lead';
    } else if (approverRole === 'lead') {
      updates.leadApproval = true;
      updates.leadApprovalAt = new Date();
      updates.approvalStatus = 'waiting_by_director';
    } else if (approverRole === 'director') {
      updates.directorApproval = true;
      updates.directorApprovalAt = new Date();
      updates.approvalStatus = 'approved';
    }
    updates.approvalComments = sequelize.fn(
      'jsonb_set', 
      sequelize.col('approvalComments'), 
      '{999999}',  // Adiciona ao final do array
      sequelize.literal(`'${JSON.stringify(comments)}'::jsonb`),
      true
    )
    return await UserSpecialty.update(updates, { where: { userId, specialtyId } });
  },

  rejectReport: async (userId: string, specialtyId: string, approverRole: string, comments: string): Promise<any> => {
    return await UserSpecialty.update(
      { 
        counselorApproval: false,
        leadApproval: false,
        directorApproval: false,
        approvalStatus: 'pending' as StatusSpecialty, 
        rejectionComments: sequelize.fn(
          'jsonb_set', 
          sequelize.col('rejectionComments'), 
          '{999999}',  // Adiciona ao final do array
          sequelize.literal(`'${JSON.stringify(comments)}'::jsonb`),
          true
        )
      },
      { where: { userId, specialtyId } }
    );
    // const statusKey = `rejected_by_${approverRole}` as StatusSpecialty;
    // return await UserSpecialty.update(
    //   { 
    //     approvalStatus: statusKey, 
    //     rejectionComments: sequelize.literal(`'${comments}'`),
    //   },
    //   { where: { userId, specialtyId } }
    // );
  },
};
