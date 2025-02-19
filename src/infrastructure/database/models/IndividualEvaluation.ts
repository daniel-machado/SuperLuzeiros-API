import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { User } from './User';

export interface IIndividualEvaluation {
  id?: string;
  dbvId?: string;
  counselorId?: string;
  evaluationDate?: Date;
  totalScore?: number;
  week?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIIndividualEvaluationAttributes extends Optional<IIndividualEvaluation, 'id' | 'createdAt' | 'updatedAt'> {}

export class IndividualEvaluation extends Model<IIndividualEvaluation, IIIndividualEvaluationAttributes > {
  public id!: string;
  public dbvId!: string;
  public counselorId!: string;
  public evaluationDate!: Date;
  public totalScore!: number;
  public week!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

IndividualEvaluation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  dbvId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  counselorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  evaluationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  week: {
    type: DataTypes.INTEGER,
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
}, { 
    sequelize, 
    modelName: 'individualEvaluation',
    tableName: 'individual_evaluations', 
    timestamps: true,
  }
);
