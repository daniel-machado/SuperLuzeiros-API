// models/EvaluationHistory.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { UnitEvaluation } from './UnitEvaluation';

export interface IEvaluationHistory {
  id?: string;
  evaluationType: string; // 'unit' ou 'individual'
  evaluationId: string;
  data: JSON;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEvaluationHistoryAttributes extends Optional<IEvaluationHistory, 'id' | 'createdAt' | 'updatedAt'> {}


class EvaluationHistory extends Model<IEvaluationHistory, IEvaluationHistoryAttributes> {
  public id!: number;
  public evaluationType!: string; // 'unit' ou 'individual'
  public evaluationId!: number;
  public data!: JSON;
  public createdAt!: Date;
}

EvaluationHistory.init(
  {
    id: { 
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    evaluationType: { 
      type: DataTypes.ENUM('unit', 'individual'), 
      allowNull: false 
    },
    evaluationId: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UnitEvaluation,
        key: 'id',
      }, 
    },
    data: { 
      type: DataTypes.JSON, 
      allowNull: false 
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
    modelName: 'EvaluationHistory', 
    tableName: 'evaluation_history',
    timestamps: true
  }
);
