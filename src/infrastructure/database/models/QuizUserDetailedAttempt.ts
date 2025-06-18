// models/QuizUserDetailedAttempt.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import { User } from './User';
import { Quiz } from './Quiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizAnswer } from './QuizAnswer';
import { Specialty } from './Specialty';
import { StatusQuiz } from '../../ENUMS/StatusQuiz';
import { QuizUserAttempt } from './QuizUserAttempt';

export interface IQuizUserDetailedAttempt {
  id?: string;
  userId: string;
  quizId: string;
  attemptId: string; // Referência ao QuizUserAttempt
  score: number;
  totalQuestions: number;
  status: StatusQuiz;
  attemptDate: Date;
  userAnswers: {
    questionId: string;
    questionText: string;
    userAnswerId: string;
    userAnswerText: string;
    isCorrect: boolean;
    correctAnswerId?: string;
    correctAnswerText?: string;
  }[];
  quizDetails?: {
    id: string;
    title: string;
    specialty: {
      id: string;
      name: string;
      category: string;
      emblem: string;
    };
  };
  summary?: {
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizUserDetailedAttemptAttributes extends Optional<IQuizUserDetailedAttempt, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuizUserDetailedAttempt extends Model<IQuizUserDetailedAttempt, IQuizUserDetailedAttemptAttributes> {
  public id!: string;
  public userId!: string;
  public quizId!: string;
  public attemptId!: string;
  public score!: number;
  public totalQuestions!: number;
  public status!: StatusQuiz;
  public attemptDate!: Date;
  public userAnswers!: {
    questionId: string;
    questionText: string;
    userAnswerId: string;
    userAnswerText: string;
    isCorrect: boolean;
    correctAnswerId?: string;
    correctAnswerText?: string;
  }[];
  public quizDetails?: {
    id: string;
    title: string;
    specialty: {
      id: string;
      name: string;
      category: string;
      emblem: string;
    };
  };
  public summary?: {
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizUserDetailedAttempt.init(
  {
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
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Quiz,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    attemptId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuizUserAttempt,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StatusQuiz)),
      allowNull: false,
    },
    attemptDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userAnswers: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    quizDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    summary: {
      type: DataTypes.JSONB,
      allowNull: true,
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
    modelName: 'quizUserDetailedAttempt',
    tableName: 'quiz_user_detailed_attempt',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['quizId'],
      },
      {
        fields: ['attemptId'],
      },
    ],
  }
);

