// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Specialty } from './Specialty';
import { Quiz } from './Quiz';
import { QuizQuestion } from './QuizQuestion';
import { StatusQuiz } from '../../ENUMS/StatusQuiz';
import { User } from './User';

export interface IQuizStatistics {
  id?: string;
  userId: string;
  quizId: string;
  attempts?: number;
  bestScore?: number;
  averageScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizStatisticsAttributes extends Optional<IQuizStatistics, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuizStatistics extends Model<IQuizStatistics, IQuizStatisticsAttributes> {
  public id!: string;
  public userId!: string;
  public quizId!: string;
  public attempts!: number;
  public bestScore!: number;
  public averageScore!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizStatistics.init(
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
    quizId: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, 
      references: { 
        model: Quiz, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bestScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0
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
    modelName: 'quizStatistics',
    tableName: 'quiz_statistics',
    timestamps: true,
  }
);