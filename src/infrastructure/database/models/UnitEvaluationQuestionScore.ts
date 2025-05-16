// models/UnitEvaluationQuestionScore.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';

export class UnitEvaluationQuestionScore extends Model {
  declare id: string;
  declare unitEvaluationId: string;
  declare questionId: string;
  declare score: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitEvaluationQuestionAttributes extends Optional<UnitEvaluationQuestionScore, 'id' | 'createdAt' | 'updatedAt'> {}

UnitEvaluationQuestionScore.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  unitEvaluationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
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
  modelName: 'UnitEvaluationQuestionScore',
  tableName: 'unit_evaluation_question_scores',
});
