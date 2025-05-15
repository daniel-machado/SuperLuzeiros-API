import { UnitDbv } from "../models/UnitDbv";
import { User, IUserAttributes, IUserCreationAttributes } from "../models/User";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUserAttributes | null>; 
  findUserById(id: string): Promise<IUserAttributes | null>; 
  findAllUsers(): Promise<any>;
  findUserByStatusPending(): Promise<any>;
  createUser(user: IUserCreationAttributes): Promise<IUserAttributes>;
  updateUser(id: string, data: Partial<IUserAttributes>, unitId?: string): Promise<IUserAttributes>;
  findByEmailWithVerificationCode(email: string): Promise<IUserAttributes | null>;
  findUserByIdWithPassword(id: string): Promise<IUserAttributes | null>;
  findByEmailWithForgotPasswordCode(email: string): Promise<IUserAttributes | null>;
  deleteUser(id: string): Promise<void>;
  
  // findUsers(filter: Record<string, any>): Promise<IUserAttributes[]>;

}

export const UserRepository: IUserRepository = {
  findUserByEmail: async (email: string): Promise<IUserAttributes | null> => {
    return await User.findOne({
      where: { email },
    });
  },
  findAllUsers: async(): Promise<any> => {
    return await User.findAll({
      attributes: ['id', 'name', 'email', 'birthDate', 'role', 'photoUrl', 'status'],
    });
  },

  findUserById: async (id: string): Promise<IUserAttributes | null> => {
    return await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] }
    });
  },

  findUserByStatusPending: async(): Promise<any> => {
    return await User.findAll({ 
      where: { status: "pending" },
      attributes: ['id', 'name', 'email', 'role', 'photoUrl', 'status', 'isActive', 'isVerified'],
    });
  },

  createUser: async (user: IUserCreationAttributes): Promise<IUserAttributes> => {
    const newUser = await User.create(user);
    return newUser;
  },

  updateUser: async (userId: string, data: Partial<IUserAttributes>, unitId?: string): Promise<IUserAttributes> => {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Atualiza os dados do usuário normalmente
    await user.update(data);
  
    //Se um unitId foi passado, verifica se precisa atualizar
    if (unitId) {
      const existingUnit = await UnitDbv.findOne({ where: { userId } });
  
      if (!existingUnit || String(existingUnit.unitId) !== String(unitId)) {
        await UnitDbv.upsert(
          { userId, unitId },
          { conflictFields: ["unitId", "userId"] } // 🔹 Usa os campos únicos corretamente
        );
      }
    }
  
    return user;
  },
  

  findByEmailWithVerificationCode: async (email: string): Promise<IUserAttributes | null> => {
    return await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'verificationCode', 'verificationCodeValidation'],
    });
  },
  findUserByIdWithPassword: async (id: string): Promise<IUserAttributes | null> => {
    return await User.findOne({
      where: { id },
      attributes: ['id', 'password'],
    });
  },
  findByEmailWithForgotPasswordCode: async (email: string): Promise<IUserAttributes | null> => {
    return await User.findOne({
      where: { email },
      attributes: ['id', 'forgotPasswordCode', 'forgotPasswordCodeValidation'],
    });
  },
  deleteUser: async (id: string): Promise<void> => {
    await User.destroy({ where: { id } });
  }









  // findByEmailWithForgotPasswordCode: function (email: string): Promise<IUserAttributes | null> {
  //   throw new Error("Function not implemented.");
  // },
  // findUsers: function (filter: Record<string, any>): Promise<IUserAttributes[]> {
  //   throw new Error("Function not implemented.");
  // },
  // updateRefreshToken: function (userId: string, refreshToken: string | null): Promise<void> {
  //   throw new Error("Function not implemented.");
  // },

};