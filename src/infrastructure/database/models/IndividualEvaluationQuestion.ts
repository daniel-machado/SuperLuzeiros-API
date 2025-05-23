import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../sequelize";


export interface IIndividualEvaluationQuestion {
  id?: string;
  question: string;
  points: number;
  typeQuestion: 'text' | 'number' | 'yes_no'; 
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIndividualEvaluationQuestionAttributes extends Optional<IIndividualEvaluationQuestion, 'id' | 'createdAt' | 'updatedAt'> {}

export class IndividualEvaluationQuestion extends Model<IIndividualEvaluationQuestion, IIndividualEvaluationQuestionAttributes > {
  public id!: string;
  public question!: string;
  public points!: number;
  public typeQuestion!: 'text' | 'number' | 'yes_no'; 
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

IndividualEvaluationQuestion.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeQuestion: {
      type: DataTypes.ENUM('text', 'number', 'yes_no'),
      allowNull: false,
      defaultValue: 'text'
    },
    description: {
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
  },
  {
    sequelize,
    modelName: 'IndividualEvaluationQuestion',
    tableName: 'individual_evaluation_questions',
    timestamps: true,
  }
);