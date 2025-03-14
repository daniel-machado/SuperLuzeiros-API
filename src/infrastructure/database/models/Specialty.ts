// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { CategorySpecialty } from '../../ENUMS/CategorySpecialty';

export interface ISpecialty {
  id?: string;
  category: CategorySpecialty;
  codeSpe?: String;
  numberSpe?: string;
  levelSpe?: number;
  yearSpe?: string;
  name: string;
  emblem?: string;
  requirements?: { question: string; options?: string[] }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISpecialtyAttributes extends Optional<ISpecialty, 'id' | 'createdAt' | 'updatedAt'> {}

export class Specialty extends Model<ISpecialty, ISpecialtyAttributes> {
  public id!: string;
  public category!: CategorySpecialty;
  public codeSpe!: String;
  public numberSpe!: string;
  public levelSpe!: number;
  public yearSpe!: string;
  public name!: string;
  public emblem!: string;
  public requirements!: { question: string; options?: string[] }[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Specialty.init(
  {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(CategorySpecialty)),
      allowNull: false,
    },
    codeSpe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberSpe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    levelSpe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    yearSpe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    emblem: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    requirements: { 
      type: DataTypes.JSON, 
      allowNull: true, 
      defaultValue: [] // [{ question: "Pergunta?", options: ["Opção A", "Opção B", "Opção C", "Opção D"] }]
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
    modelName: 'specialty',
    tableName: 'specialty',
    timestamps: true,
  }
);