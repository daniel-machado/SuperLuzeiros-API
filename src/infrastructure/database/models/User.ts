import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { UnitCounselor } from './UnitCounselor';
import { UnitDbv } from './UnitDbv';

// Definindo a interface para os atributos de um usuário
export interface IUserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  role?: 'pending' | 'admin' | 'dbv' | 'director' | 'lead' | 'counselor' | 'secretary';
  photoUrl?: string;
  isActive?: boolean,
  isVerified?: boolean,
  createdAt?: Date;
  updatedAt?: Date;
  verificationCode?: string;
  verificationCodeValidation?: number;
  forgotPasswordCode?: string;
  forgotPasswordCodeValidation?: number
  deleteAccountCode?: string; 
  deleteAccountCodeValidation?: number;
  status?: 'pending' | 'approved' | 'rejected';
}

// A interface para a criação do usuário (sem o id e sem createdAt e updatedAt, pois são gerados automaticamente)
export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<IUserAttributes, IUserCreationAttributes> {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public birthDate!: string;
  public role!: 'pending' | 'admin' | 'dbv' | 'director' | 'lead' | 'counselor' | 'secretary';
  public photoUrl?: string;
  public isActive?: boolean;
  public isVerified?: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public verificationCode?: string;
  public verificationCodeValidation?: number;
  public forgotPasswordCode?: string;
  public forgotPasswordCodeValidation?: number
  public deleteAccountCode?: string; 
  public deleteAccountCodeValidation?: number;
  public status?: 'pending' | 'approved' | 'rejected';
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("pending", "admin", "dbv", "director", "lead", "counselor", "secretary"),
      allowNull: false,
      defaultValue: 'pending',
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationCodeValidation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    forgotPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgotPasswordCodeValidation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deleteAccountCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleteAccountCodeValidation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: 'pending',
    }
  },
  {
    sequelize,
    modelName: "users",
    timestamps: true,
  }
);

// Relacionamento com UnitCounselor e UnitDbv
//User.hasMany(UnitCounselor, { foreignKey: 'userId', as: 'counselors' });
//User.hasMany(UnitDbv, { foreignKey: 'userId', as: 'dbvs' });
