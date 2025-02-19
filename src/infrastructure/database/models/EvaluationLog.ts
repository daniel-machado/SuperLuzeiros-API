// models/EvaluationHistory.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';

export interface IEvaluationLog {
  id?: string;
  unitId: string;
  evaluatedBy: string;
  action: "created" |"updated" | "deleted";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEvaluationLogAttributes extends Optional<IEvaluationLog, 'id' | 'createdAt' | 'updatedAt'> {}


export class EvaluationLog extends Model<IEvaluationLog, IEvaluationLogAttributes> {
  public id!: number;
  public unitId!: string;
  public evaluatedBy!: string;
  public action!: "created" |"updated" | "deleted";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EvaluationLog.init(
  {
    id: { 
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Unit,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    evaluatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("created", "updated", "deleted"),
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
    modelName: 'EvaluationLogs', 
    tableName: 'evaluation_logs',
    timestamps: true
  }
);
