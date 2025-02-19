import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { IndividualEvaluationQuestion } from './IndividualEvaluationQuestion';
import { User } from './User';

export interface IIndividualEvaluationAnswer {
  id?: string;
  userId?: string;
  questionId?: string;
  answer: string;
  score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIndividualEvaluationAnswerAttributes extends Optional<IIndividualEvaluationAnswer, 'id' | 'createdAt' | 'updatedAt'> {}

export class IndividualEvaluationAnswer extends Model<IIndividualEvaluationAnswer, IIndividualEvaluationAnswerAttributes> {
  public id!: string;
  public userId!: string;
  public questionId!: string;
  public answer!: string;
  public score!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IndividualEvaluationAnswer.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: IndividualEvaluationQuestion,
        key: 'id',
      },
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: 'IndividualEvaluationAnswer',
    tableName: 'individual_evaluation_answers',
    timestamps: true,
  }
);

// Definir relações
IndividualEvaluationAnswer.belongsTo(IndividualEvaluationQuestion, {
  foreignKey: 'questionId',
  as: 'question',
});

IndividualEvaluationAnswer.belongsTo(User, {
  foreignKey: 'userId',
  as: 'dbv',
});
