// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { User } from './User';
import { Class } from './Class';

export interface IUserClass {
  id?: string;
  userId: string;
  classId: string;
  assignedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserClassAttributes extends Optional<IUserClass, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserClass extends Model<IUserClass, IUserClassAttributes> {
  public id!: string;
  public userId!: string;
  public classId!: string;
  public assignedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserClass.init(
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
        key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    classId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, 
      references: { 
        model: Class, 
        key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    assignedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { 
        model: User, 
        key: 'id' 
      },
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
    modelName: 'UserClass',
    tableName: 'user_class',
    timestamps: true,
  }
);