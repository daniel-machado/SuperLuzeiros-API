// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Specialty } from './Specialty';
import { Quiz } from './Quiz';
import { QuizQuestion } from './QuizQuestion';

export interface IQuizAnswer {
  id?: string;
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizAnswerAttributes extends Optional<IQuizAnswer, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuizAnswer extends Model<IQuizAnswer, IQuizAnswerAttributes> {
  public id!: string;
  public questionId!: string;
  public answer!: string;
  public isCorrect!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizAnswer.init(
  {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    questionId: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, 
      references: { 
        model: QuizQuestion, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    answer: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
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
    modelName: 'quizAnswer',
    tableName: 'quiz_answer',
    timestamps: true,
  }
);