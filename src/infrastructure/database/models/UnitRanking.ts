import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IUnitRanking {
  id?: string;
  unitId: string;
  week: number;
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitRankingAttributes extends Optional<IUnitRanking, 'id' | 'createdAt' | 'updatedAt'> {}

export class UnitRanking extends Model<IUnitRanking> {
  public id!: string;
  public unitId!: string;
  public week!: number;
  public totalScore!: number;
  public correctAnswers!: number;
  public wrongAnswers!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
UnitRanking.init({
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
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalScore: {
    type: DataTypes.INTEGER,
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
    modelName: 'UnitRanking', 
    tableName: 'unit_ranking',
    timestamps: true
  }
);
