import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IUnitEvaluationQuestion {
  id?: string;
  question?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitEvaluationQuestionAttributes extends Optional<IUnitEvaluationQuestion, 'id' | 'createdAt' | 'updatedAt'> {}

export class UnitEvaluationQuestion extends Model<IUnitEvaluationQuestion, IUnitEvaluationQuestionAttributes> {
  public id!: string;
  public question!: string;
  public points!: number;
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
