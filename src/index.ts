import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


// Banco de Dados
import sequelize from './infrastructure/database/sequelize'
//import connectDB from './infrastructure/database/db'; //Conexão Antiga

// Rotas
import authRoutes from './interfaces/routes/authRoutes';
import unitRoutes from './interfaces/routes/unitRoutes';
import userRoutes from './interfaces/routes/userRoutes';

// Unit Evaluation 
import unitEvaluationRoutes from './interfaces/routes/unitEvaluationRoutes';
import unitQuestionsRoutes from './interfaces/routes/unitQuestionsRoutes';
import unitAnswerRoutes from './interfaces/routes/unitAnswerRoutes';

// Individual Evaluation
import IndividualEvaluationRoutes from './interfaces/routes/individualEvaluationRoutes';
import IndividualQuestionsRoutes from './interfaces/routes/individualQuestionsRoutes';
import IndividualAnswerRoutes from './interfaces/routes/individualAnswerRoutes';

// Rankings
import unitRankingRoutes from './interfaces/routes/unitRankingRoutes';
import IndividualRankingRoutes from './interfaces/routes/individualRankingRoutes';

// Specialtys
import specialtyUserRoutes from './interfaces/routes/specialtyUserRoutes';
import specialtyRoutes from './interfaces/routes/specialtyRoutes';

import classRoutes from './interfaces/routes/classRoutes';
import classUserRoutes from './interfaces/routes/classUserRoutes';

// Quiz
import quizRoutes from './interfaces/routes/quizRoutes';
import quizQuestionRoutes from './interfaces/routes/quizQuestionRoutes';
import quizAnswerRoutes from './interfaces/routes/quizAnswerRoutes';
import quizAttemptRoutes from './interfaces/routes/quizAttemptRoutes';
import quizStatisticsRoutes from './interfaces/routes/quizStatisticsRoutes';

import quizDetailedAttemptRoutes from './interfaces/routes/QuizDetailedAttemptRoutes';

// BIblical
import biblicalCapitulosRoutes from './interfaces/routes/biblicalCapitulosRoutes'

import dailyVerseRoutes from './interfaces/routes/dailyVerseRoutes'

dotenv.config();

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
    console.log('Database connected successfully.');
    sequelize.sync();
    
    const app = express();
    
    app.use(express.json());
    app.use(cors({
      origin: [
        "http://localhost:5173", // Frontend Web (React/Vite)
        "http://localhost:4173",
        "https://luzeirosdonorte.com.br",
        "https://d2p2io5k8ibrc9.cloudfront.net/",
        "http://seu-site.com", // Caso tenha um domínio em produção
        "exp://192.168.1.10:19000", // Expo Go no celular (React Native)
        "http://localhost" // Para aplicativos móveis (Android/iOS)
      ],
      allowedHeaders: ["Content-Type", "Authorization"], // Permite envio de tokens no header
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Define os métodos HTTP permitidos
      credentials: true
    }));

    // app.use(cors({
    //   origin: [
    //     "http://localhost:5173", // Frontend Web (React/Vite)
    //     "http://seu-site.com", // Caso tenha um domínio em produção
    //     "exp://192.168.1.10:19000", // Expo Go no celular (React Native)
    //     "http://localhost" // Para aplicativos móveis (Android/iOS)
    //   ],
    //   credentials: true, // Permite cookies e autenticação
    //   methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    //   allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
    // }));

    app.use(helmet());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/auth', authRoutes);
    app.use('/api/unit', unitRoutes);
    app.use('/api/user', userRoutes);

    // Unit Evaluation
    app.use('/api/unit-evaluation', unitEvaluationRoutes);
    app.use('/api/unit-questions', unitQuestionsRoutes);
    app.use('/api/unit-answer', unitAnswerRoutes);

    // Individual Evaluation
    app.use('/api/individual-evaluation', IndividualEvaluationRoutes);
    app.use('/api/individual-questions', IndividualQuestionsRoutes);
    app.use('/api/individual-answer', IndividualAnswerRoutes);
    
    // Rankings
    app.use('/api/unit-ranking', unitRankingRoutes);
    app.use('/api/individual-ranking', IndividualRankingRoutes);
    

    // Especialidades
    app.use('/api/specialty', specialtyRoutes);
    app.use('/api/specialty-user', specialtyUserRoutes);

    // Classes
    app.use('/api/class', classRoutes);
    app.use('/api/class-user', classUserRoutes);


    // Quiz
    app.use('/api/quiz', quizRoutes);
    app.use('/api/quiz-question', quizQuestionRoutes);
    app.use('/api/quiz-answer', quizAnswerRoutes);
    app.use('/api/quiz-user-attempt', quizAttemptRoutes);
    app.use('/api/quiz-statistics', quizStatisticsRoutes);

    app.use('/api/quiz-detailed-attempt', quizDetailedAttemptRoutes);

    app.use('/api/bible', biblicalCapitulosRoutes);

    app.use('/api/daily-reading', dailyVerseRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Erro ao conectar ao banco de dados', error));
