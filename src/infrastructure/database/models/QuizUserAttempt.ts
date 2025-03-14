// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Specialty } from './Specialty';
import { Quiz } from './Quiz';
import { QuizQuestion } from './QuizQuestion';
import { StatusQuiz } from '../../ENUMS/StatusQuiz';
import { User } from './User';

export interface IQuizUserAttempt {
  id?: string;
  userId: string;
  quizId: string;
  score?: number;
  status?: StatusQuiz;
  attemptDate?: Date;
  failedAttempts?: number;
  failedQuizzes?: number;
  lastAttempt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizUserAttemptAttributes extends Optional<IQuizUserAttempt, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuizUserAttempt extends Model<IQuizUserAttempt, IQuizUserAttemptAttributes> {
  public id!: string;
  public userId!: string;
  public quizId!: string;
  public score!: number;
  public status!: StatusQuiz;
  public attemptDate!: Date;
  public failedAttempts!: number;
  public failedQuizzes!: number;
  public lastAttempt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizUserAttempt.init(
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
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: { 
      type: DataTypes.ENUM(...Object.values(StatusQuiz)), 
      allowNull: false, 
      defaultValue: 'pending' 
    },
    attemptDate: { 
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    failedQuizzes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastAttempt: {
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
    modelName: 'quizUserAttempt',
    tableName: 'quiz_user_attempt',
    timestamps: true,
  }
);