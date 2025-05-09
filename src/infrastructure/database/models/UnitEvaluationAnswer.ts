import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { UnitEvaluation } from './UnitEvaluation';
import { UnitEvaluationQuestion } from './UnitEvaluationQuestion';
import { Unit } from './Unit';

export interface IUnitEvaluationAnswer {
  id?: string;
  unitId?: string;
  unitEvaluationId?: string;
  questionId: string;
  week?: number; 
  answer: string;
  score?: string;
  observation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitEvaluationAnswerAttributes extends Optional<IUnitEvaluationAnswer, 'id' | 'createdAt' | 'updatedAt'> {}

export class UnitEvaluationAnswer extends Model<IUnitEvaluationAnswer, IUnitEvaluationAnswerAttributes> {
  public id!: string;
  public unitId!: string;
  public unitEvaluationId!: string;
  public questionId!: string;
  public answer!: string;
  public score!: string;
  public week!: number;
  public observation?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
UnitEvaluationAnswer.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  unitId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Unit,
      key: 'id',
    },
  },
  unitEvaluationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UnitEvaluation,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UnitEvaluationQuestion,
      key: 'id',
    },
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, 
  },
  observation:{
    type: DataTypes.STRING,
    allowNull: true
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
}, { 
    sequelize, 
    modelName: 'unitEvaluationAnswer', 
    tableName: 'unit_evaluation_answers',
    timestamps: true
  }
);
