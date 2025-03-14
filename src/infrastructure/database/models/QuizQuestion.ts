// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Specialty } from './Specialty';
import { Quiz } from './Quiz';

export interface IQuizQuestion {
  id?: string;
  quizId: string;
  question: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizQuestionAttributes extends Optional<IQuizQuestion, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuizQuestion extends Model<IQuizQuestion, IQuizQuestionAttributes> {
  public id!: string;
  public quizId!: string;
  public question!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizQuestion.init(
  {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    question: { 
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'quizQuestion',
    tableName: 'quiz_question',
    timestamps: true,
  }
);