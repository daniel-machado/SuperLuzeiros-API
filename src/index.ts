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
import unitEvaluationRoutes from './interfaces/routes/unitEvaluationRoutes';
import unitQuestionsRoutes from './interfaces/routes/unitQuestionsRoutes';
import unitAnswerRoutes from './interfaces/routes/unitAnswerRoutes';
import unitRankingRoutes from './interfaces/routes/unitRankingRoutes';

dotenv.config();

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
    console.log('Database connected successfully.');
    sequelize.sync();
    
    const app = express();
    
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/auth', authRoutes);
    app.use('/api/unit', unitRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/unit-evaluation', unitEvaluationRoutes);
    app.use('/api/unit-questions', unitQuestionsRoutes);
    app.use('/api/unit-answer', unitAnswerRoutes);
    app.use('/api/unit-ranking', unitRankingRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Erro ao conectar ao banco de dados', error));
