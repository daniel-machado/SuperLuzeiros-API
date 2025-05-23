// models/EvaluationHistory.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { UnitEvaluation } from './UnitEvaluation';

export interface IDailyVerseReading {
  id?: string;
  userId: string; 
  date: Date;
  readAt: Date;
  verse: string;
  book: string;
  chapter: string
  streak: number;
  life: number;
  pointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDailyVerseReadingAttributes extends Optional<IDailyVerseReading, 'id' | 'createdAt' | 'updatedAt'> {}


export class DailyVerseReading extends Model<IDailyVerseReading, IDailyVerseReadingAttributes> {
  public id!: string;
  public userId!: string; 
  public date!: Date;
  public readAt!: Date;
  public verse!: string;
  public streak!: number;
  public life!: number
  public book!: string;
  public chapter!: string;
  public pointsEarned!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

DailyVerseReading.init(
  {
    id: { 
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: { 
        model: 'users', 
        key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY, // Armazena apenas a data (sem hora)
      allowNull: false,
      get() {
        // Garante que retorna como Date no fuso local
        const value = this.getDataValue('date');
        return value ? new Date(value + 'T00:00:00') : null;
      },
      // set(value: Date){
      //   const localDate = format(value, 'yyyy-MM-dd') //Armazena como string local
      //   this.setDataValue('date', localDate)
      // }
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get() {
        // Formata para o fuso horário local
        const rawValue = this.getDataValue('readAt');
        return rawValue ? new Date(rawValue) : null;
      }
    },
    book: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    chapter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    life: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    pointsEarned: {
      type: DataTypes.INTEGER,
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
  },
  { 
    sequelize, 
    modelName: 'DailyVerseReading', 
    tableName: 'daily_verse_readings',
    indexes: [
    {
      unique: true,
      fields: ['userId', 'date'],
    },
  ],
  timestamps: true
  }
);






