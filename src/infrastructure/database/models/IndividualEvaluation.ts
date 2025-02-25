import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { User } from './User';

export interface IIndividualEvaluation {
  id?: string;
  userId?: string;
  counselorId?: string;
  status?: 'open' | 'closed'; 
  evaluationDate?: Date;
  totalScore?: number;
  week?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIndividualEvaluationAttributes extends Optional<IIndividualEvaluation, 'id' | 'createdAt' | 'updatedAt'> {}

export class IndividualEvaluation extends Model<IIndividualEvaluation, IIndividualEvaluationAttributes > {
  public id!: string;
  public userId!: string;
  public counselorId!: string;
  public status!: 'open' | 'closed';
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  counselorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  evaluationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("open","closed"),
    defaultValue: "open"
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
    tableName: 'individual_evaluation', 
    timestamps: true,
  }
);
