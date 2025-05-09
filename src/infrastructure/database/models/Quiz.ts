// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Specialty } from './Specialty';

export interface IQuiz {
  id?: string;
  specialtyId: string;
  title: string;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizAttributes extends Optional<IQuiz, 'id' | 'createdAt' | 'updatedAt'> {}

export class Quiz extends Model<IQuiz, IQuizAttributes> {
  public id!: string;
  public specialtyId!: string;
  public title!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quiz.init(
  {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    title: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    modelName: 'quiz',
    tableName: 'quiz',
    timestamps: true,
  }
);