import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IUnitEvaluation {
  id?: string;
  unitId?: string;
  evaluatedBy?: string;
  status?: 'open' | 'closed';
  totalScore?: number;
  correctAnswers: number;
  wrongAnswers: number;
  week?: number;
  examScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitEvaluationAttributes extends Optional<IUnitEvaluation, 'id' | 'createdAt' | 'updatedAt'> {}

export class UnitEvaluation extends Model<IUnitEvaluation> {
  public id!: string;
  public unitId!: string;
  public evaluatedBy!: string;
  public status!: 'open' | 'closed';
  public totalScore!: number;
  public correctAnswers!: number;
  public wrongAnswers!: number;
  public week!: number;
  public examScore!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
UnitEvaluation.init({
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
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  evaluatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  status: {
    type: DataTypes.ENUM("open","closed"),
    defaultValue: "open"
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  examScore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  wrongAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalScore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
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
}, { 
    sequelize, 
    modelName: 'unitEvaluation', 
    tableName: 'unit_evaluation',
    timestamps: true
  }
);
