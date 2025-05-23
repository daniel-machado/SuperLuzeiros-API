import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IUnitEvaluationQuestion {
  id?: string;
  question: string;
  points: number;
  typeQuestion: 'text' | 'number' | 'yes_no'; 
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitEvaluationQuestionAttributes extends Optional<IUnitEvaluationQuestion, 'id' | 'createdAt' | 'updatedAt'> {}

export class UnitEvaluationQuestion extends Model<IUnitEvaluationQuestion, IUnitEvaluationQuestionAttributes> {
  public id!: string;
  public question!: string;
  public points!: number;
  public typeQuestion!: 'text' | 'number' | 'yes_no'; 
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
UnitEvaluationQuestion.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  typeQuestion: {
    type: DataTypes.ENUM('text', 'number', 'yes_no'),
    allowNull: false,
    defaultValue: 'text'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
}, { 
    sequelize, 
    modelName: 'unitEvaluationQuestion', 
    tableName: 'unit_evaluation_questions',
    timestamps: true
  }
);
