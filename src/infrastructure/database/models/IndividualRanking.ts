import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IIndividualRanking {
  id?: string;
  dbvId: string;
  week: number;
  totalScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIndividualRankingAttributes extends Optional<IIndividualRanking, 'id' | 'createdAt' | 'updatedAt'> {}

export class IndividualRanking extends Model<IIndividualRanking> {
  public id!: string;
  public dbvId!: string;
  public week!: number;
  public totalScore!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
IndividualRanking.init({
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
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalScore: {
    type: DataTypes.DECIMAL(10, 1),
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
    modelName: 'individualRanking', 
    tableName: 'individual_ranking',
    timestamps: true
  }
);
