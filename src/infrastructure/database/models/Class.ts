// models/unit.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { CategorySpecialty } from '../../ENUMS/CategorySpecialty';
import { TypeClass } from '../../ENUMS/TypeClass'

export interface IClass {
  id?: string;
  name: string;
  type: TypeClass;
  minAge: number;
  maxAge?: number;
  emblem?: string;
  requirements?: { question: string; options?: string[] }[];
  createdAt?: Date
  updatedAt?: Date
}

export interface IClassAttributes extends Optional<IClass, 'id' | 'createdAt' | 'updatedAt'> {}

export class Class extends Model<IClass, IClassAttributes> {
  public id!: string;
  public name!: string;
  public type!: TypeClass;
  public minAge!: number;
  public maxAge!: number;
  public emblem!: string;
  public requirements!: { question: string; options?: string[] }[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TypeClass)),
      allowNull: false,
    },
    emblem: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    minAge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxAge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    requirements: { 
      type: DataTypes.JSONB, 
      allowNull: true, 
      defaultValue: []
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
    modelName: 'class',
    tableName: 'class',
    timestamps: true,
  }
);