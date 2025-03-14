// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { User } from './User';
import { Specialty } from './Specialty';
import { StatusSpecialty } from '../../ENUMS/StatusSpecialty';

export interface IUserSpecialty {
  id?: string;
  userId: string;
  specialtyId: string;
  approvalStatus?: StatusSpecialty;
  report?: JSON;
  rejectionComments?: JSON;
  approvalComments?: JSON
  isQuizApproved?: boolean;
  counselorApproval?: boolean;
  leadApproval?: boolean;
  directorApproval?: boolean;
  directorApprovalAt?: Date;
  counselorApprovalAt?: Date;
  leadApprovalAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserSpecialtyAttributes extends Optional<IUserSpecialty, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserSpecialty extends Model<IUserSpecialty, IUserSpecialtyAttributes> {
  public id!: string;
  public userId!: string;
  public specialtyId!: string;
  public approvalStatus!: StatusSpecialty
  public report!: JSON;
  public rejectionComments!: JSON;
  public approvalComments!: JSON;
  public isQuizApproved!: boolean;
  public counselorApproval!: boolean;
  public leadApproval!: boolean;
  public directorApproval!: boolean;
  public counselorApprovalAt!: Date;
  public leadApprovalAt!: Date;
  public directorApprovalAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserSpecialty.init(
  {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, 
      references: { 
        model: User, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    specialtyId: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, 
      references: { 
        model: Specialty, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    approvalStatus: { 
      type: DataTypes.ENUM(...Object.values(StatusSpecialty)), 
      allowNull: true, 
      defaultValue: 'pending' 
    },
    report: { 
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    rejectionComments: { 
      type: DataTypes.JSONB, 
      allowNull: true,
      defaultValue: []
    },
    approvalComments: { 
      type: DataTypes.JSONB, 
      allowNull: true,
      defaultValue: []
    },
    isQuizApproved: { 
      type: DataTypes.BOOLEAN, 
      allowNull: true,
      defaultValue: false 
    },
    counselorApproval: { 
      type: DataTypes.BOOLEAN, 
      allowNull: true,
      defaultValue: false 
    },
    counselorApprovalAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    leadApproval: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    leadApprovalAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    directorApproval: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    directorApprovalAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { 
    sequelize, 
    modelName: 'userSpecialty',
    tableName: 'user_specialty',
    timestamps: true,
  }
);