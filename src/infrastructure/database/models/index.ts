import { Sequelize } from "sequelize";
import * as config from '../config/config';

// Inicializa a conexão com o banco
const sequelize = new Sequelize(config);

// Importa os modelos
import { User } from "./User";
import { Unit } from "./Unit";
import { RefreshToken } from "./RefreshToken";
import { UnitDbv } from "./UnitDbv";
import { UnitCounselor } from "./UnitCounselor";

import { UnitEvaluationQuestion } from "./UnitEvaluationQuestion";
import { UnitEvaluation } from "./UnitEvaluation";
import { UnitEvaluationAnswer } from "./UnitEvaluationAnswer";

import { IndividualEvaluation } from "./IndividualEvaluation";
import { IndividualEvaluationQuestion } from "./IndividualEvaluationQuestion";
import { IndividualEvaluationAnswer } from "./IndividualEvaluationAnswer";

import { UnitRanking } from "./UnitRanking";
import { IndividualRanking } from "./IndividualRanking";
import { Specialty } from "./Specialty";
import { UserSpecialty } from "./UserSpecialty";
import { QuizQuestion } from "./QuizQuestion";
import { QuizAnswer } from "./QuizAnswer";
import { UserClass } from "./ClassUser";
import { Class } from "./Class";
import { DailyVerseReading } from "./dailyVerseReading";
import { Quiz } from "./Quiz";
import { QuizStatistics } from "./QuizStatistics";
import { QuizUserAttempt } from "./QuizUserAttempt";
import { QuizUserDetailedAttempt } from "./QuizUserDetailedAttempt";

// Object.values(models).forEach((model: any) => {
//   if(model.init){
//     model.init(sequelize);
//   }
// });


// USER RELATIONSHIPS
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'refreshUser' });


// UNIT RELATIONSHIPS
Unit.hasMany(UnitCounselor, { foreignKey: 'unitId', as: 'counselors' });
Unit.hasMany(UnitDbv, { foreignKey: 'unitId', as: 'dbvs' });
UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });
UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });


// UNIT EVALUATIONS
UnitEvaluation.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitEvaluationId', as: 'answers' });
UnitEvaluationAnswer.belongsTo(UnitEvaluation, { foreignKey: 'unitEvaluationId', as: 'evaluation' });
UnitEvaluation.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Unit.hasMany(UnitEvaluation, { foreignKey: 'unitId', as: 'evaluations' });
UnitEvaluationAnswer.belongsTo(Unit, { foreignKey: 'unitId', as: "unitAnswerToUnit" });
Unit.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitId', as: "unitToAnswer" });
UnitEvaluationQuestion.hasMany(UnitEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswers" });
UnitEvaluationAnswer.belongsTo(UnitEvaluationQuestion, { foreignKey: 'questionId', as: "unitAnswers" });


// RANKINGS
UnitRanking.belongsTo(Unit, { foreignKey: 'unitId', as: 'unitRank' });
Unit.hasMany(UnitRanking, { foreignKey: 'unitId', as: 'unitRankings' });
IndividualRanking.belongsTo(User, { foreignKey: 'dbvId', as: 'individualRank' });
User.hasMany(IndividualRanking, { foreignKey: 'dbvId', as: 'individualRankings' });


// INDIVIDUAL EVALUATIONS
IndividualEvaluation.hasMany(IndividualEvaluationAnswer, { foreignKey: 'individualEvaluationId', as: 'Individualanswers' });
IndividualEvaluationAnswer.belongsTo(IndividualEvaluation, { foreignKey: 'individualEvaluationId', as: 'Individualevaluation' });
IndividualEvaluationQuestion.hasMany(IndividualEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswersIndividual" });
IndividualEvaluationAnswer.belongsTo(IndividualEvaluationQuestion, { foreignKey: 'questionId', as: "EvaluationIndividualQuestion" });
IndividualEvaluationAnswer.belongsTo(User, { foreignKey: 'userId', as: "individualAnswerToUser" });
User.hasMany(IndividualEvaluationAnswer, { foreignKey: 'userId', as: "individualUserToAnswer" });
IndividualEvaluation.belongsTo(User, { foreignKey: 'userId', as: 'usersEvaluation' });
User.hasMany(IndividualEvaluation, { foreignKey: 'userId', as: 'evaluationsUser' });


// SPECIALTIES AND CLASSES
UserSpecialty.belongsTo(User, { foreignKey: 'userId', as: 'specialtyUser' });
User.hasMany(UserSpecialty, { foreignKey: 'userId', as: 'userSpecialties' });
UserSpecialty.belongsTo(Specialty, {foreignKey: 'specialtyId', as: 'specialtyInfo'});
UserClass.belongsTo(User, { foreignKey: 'userId', as: 'classUser' });
User.hasMany(UserClass, { foreignKey: 'userId', as: 'userClass' });
UserClass.belongsTo(Class, {foreignKey: 'classId', as: 'classInfo'});


// DAILY VERSE
DailyVerseReading.belongsTo(User, { foreignKey: 'userId', as: 'userReading' });
User.hasMany(DailyVerseReading, { foreignKey: 'userId', as: 'readings' });


// QUIZ RELATIONSHIPS
Quiz.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });
Specialty.hasMany(Quiz, { foreignKey: 'specialtyId', as: 'quizzes' });
Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId', as: 'questions' });
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
QuizQuestion.hasMany(QuizAnswer, { foreignKey: "questionId", as: "quizAnswers" });
QuizAnswer.belongsTo(QuizQuestion, { foreignKey: "questionId", as: "quizquestion" });
Quiz.hasMany(QuizStatistics, { foreignKey: 'quizId', as: 'statistics' });
QuizStatistics.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
User.hasMany(QuizStatistics, { foreignKey: 'userId', as: 'quizStatistics' });
QuizStatistics.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Quiz.hasMany(QuizUserAttempt, { foreignKey: 'quizId', as: 'userAttempts' });
QuizUserAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
User.hasMany(QuizUserAttempt, { foreignKey: 'userId', as: 'quizAttempts' });
QuizUserAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });


// NEW DETAILED ATTEMPT RELATIONSHIPS
QuizUserDetailedAttempt.belongsTo(QuizUserAttempt, { foreignKey: 'attemptId', as: 'attempt' });
QuizUserAttempt.hasOne(QuizUserDetailedAttempt, { foreignKey: 'attemptId', as: 'detailedAttempt' });
QuizUserDetailedAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(QuizUserDetailedAttempt, { foreignKey: 'userId', as: 'detailedQuizAttempts' });
QuizUserDetailedAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
Quiz.hasMany(QuizUserDetailedAttempt, { foreignKey: 'quizId', as: 'detailedAttempts' });

QuizUserDetailedAttempt.belongsTo(QuizStatistics, { 
  foreignKey: 'quizId', 
  targetKey: 'quizId', 
  as: 'stats' 
});

QuizStatistics.hasMany(QuizUserDetailedAttempt, { 
  foreignKey: 'quizId', 
  sourceKey: 'quizId', 
  as: 'detailedAttempts' 
});


















































// RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'refreshUser' });

// // Define os relacionamentos

// // Relacionamento: Uma unidade tem vários conselheiros
// Unit.hasMany(UnitCounselor, { foreignKey: 'unitId', as: 'counselors' });
// // Relacionamento: Uma unidade tem vários desbravadores
// Unit.hasMany(UnitDbv, { foreignKey: 'unitId', as: 'dbvs' });

// UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });
// UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });



// // UNIT EVALUATIONS

// // Define que uma(UnitEvaluation) pode ter várias respostas (UnitEvaluationAnswer).
// UnitEvaluation.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitEvaluationId', as: 'answers' });
// // significa que cada resposta (UnitEvaluationAnswer) pertence a uma única avaliação (UnitEvaluation).
// UnitEvaluationAnswer.belongsTo(UnitEvaluation, { foreignKey: 'unitEvaluationId', as: 'evaluation' });

// // Cada UnitEvaluation pertence a uma única Unit.
// UnitEvaluation.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
// //Uma Unit pode ter muitas UnitEvaluations associadas.
// Unit.hasMany(UnitEvaluation, { foreignKey: 'unitId', as: 'evaluations' });

// // Uma resposta pertence a um usuário
// UnitEvaluationAnswer.belongsTo(Unit, { foreignKey: 'unitId', as: "unitAnswerToUnit" });
// // Um usuário pode ter várias respostas
// Unit.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitId', as: "unitToAnswer" });


// // Uma pergunta pode ter várias respostas
// UnitEvaluationQuestion.hasMany(UnitEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswers" });
// // Uma resposta pertence a uma única pergunta
// UnitEvaluationAnswer.belongsTo(UnitEvaluationQuestion, { foreignKey: 'questionId', as: "unitAnswers" });

// //Cada ranking pertence a uma única unidade
// UnitRanking.belongsTo(Unit, { 
//   foreignKey: 'unitId', 
//   as: 'unitRank' 
// });
// // Uma unidade por ter vários rankings
// Unit.hasMany(UnitRanking, { 
//   foreignKey: 'unitId', 
//   as: 'unitRankings' 
// });

// //Cada ranking pertence a uma única user
// IndividualRanking.belongsTo(User, { 
//   foreignKey: 'dbvId', 
//   as: 'individualRank' 
// });
// // Uma unidade por ter vários rankings
// User.hasMany(IndividualRanking, { 
//   foreignKey: 'dbvId', 
//   as: 'individualRankings' 
// });



// // Individual Evaluation

// // Define que uma(UnitEvaluation) pode ter várias respostas (UnitEvaluationAnswer).
// IndividualEvaluation.hasMany(IndividualEvaluationAnswer, { foreignKey: 'individualEvaluationId', as: 'Individualanswers' });
// // significa que cada resposta (UnitEvaluationAnswer) pertence a uma única avaliação (UnitEvaluation).
// IndividualEvaluationAnswer.belongsTo(IndividualEvaluation, { foreignKey: 'individualEvaluationId', as: 'Individualevaluation' });

// // Uma pergunta pode ter várias respostas
// IndividualEvaluationQuestion.hasMany(IndividualEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswersIndividual" });
// // Uma resposta pertence a uma única pergunta
// IndividualEvaluationAnswer.belongsTo(IndividualEvaluationQuestion, { foreignKey: 'questionId', as: "EvaluationIndividualQuestion" });

// // Uma resposta pertence a um usuário
// IndividualEvaluationAnswer.belongsTo(User, { foreignKey: 'userId', as: "individualAnswerToUser" });
// // Um usuário pode ter várias respostas
// User.hasMany(IndividualEvaluationAnswer, { foreignKey: 'userId', as: "individualUserToAnswer" });

// // Cada UnitEvaluation pertence a uma única Unit.
// IndividualEvaluation.belongsTo(User, { foreignKey: 'userId', as: 'usersEvaluation' });
// //Uma Unit pode ter muitas UnitEvaluations associadas.
// User.hasMany(IndividualEvaluation, { foreignKey: 'userId', as: 'evaluationsUser' });




// // Cada UserSpecialty pertence a um unicio User.
// UserSpecialty.belongsTo(User, { foreignKey: 'userId', as: 'specialtyUser' });
// //Um user pode ter muitas UserSpecialty associadas.
// User.hasMany(UserSpecialty, { foreignKey: 'userId', as: 'userSpecialties' });

// // Relacionamento com Specialty
// UserSpecialty.belongsTo(Specialty, {foreignKey: 'specialtyId', as: 'specialtyInfo'});


// // Cada UserSpecialty pertence a um unicio User.
// UserClass.belongsTo(User, { foreignKey: 'userId', as: 'classUser' });
// //Um user pode ter muitas UserSpecialty associadas.
// User.hasMany(UserClass, { foreignKey: 'userId', as: 'userClass' });

// // Relacionamento com Specialty
// UserClass.belongsTo(Class, {foreignKey: 'classId', as: 'classInfo'});


// DailyVerseReading.belongsTo(User, {
//   foreignKey: 'userId', // Nome do campo que é a chave estrangeira
//   targetKey: 'id',     // Campo referenciado na tabela User
//   as: 'userReading'          // Alias para o relacionamento (opcional, mas recomendado)
// });

// User.hasMany(DailyVerseReading, {
//   foreignKey: 'userId',
//   as: 'readings' // Nome do relacionamento para acessar as leituras do usuário
// });


// // ============================================
// // RELACIONAMENTOS QUIZ
// // ============================================


// // Quiz pertence a uma Specialty
// Quiz.belongsTo(Specialty, { 
//   foreignKey: 'specialtyId', 
//   as: 'specialty' 
// });


// // Specialty pode ter muitos Quizzes
// Specialty.hasMany(Quiz, { 
//   foreignKey: 'specialtyId', 
//   as: 'quizzes' 
// });


// // Quiz tem muitas Questions
// Quiz.hasMany(QuizQuestion, { 
//   foreignKey: 'quizId', 
//   as: 'questions' 
// });


// // QuizQuestion pertence a um Quiz
// QuizQuestion.belongsTo(Quiz, { 
//   foreignKey: 'quizId', 
//   as: 'quiz' 
// });

// // QuizQuestion tem muitas Answers
// QuizQuestion.hasMany(QuizAnswer, { 
//   foreignKey: "questionId", 
//   as: "quizAnswers"
// });

// // QuizAnswer pertence a uma Question
// QuizAnswer.belongsTo(QuizQuestion, { 
//   foreignKey: "questionId", 
//   as: "quizquestion" 
// });

// // Quiz tem muitas Statistics
// Quiz.hasMany(QuizStatistics, { 
//   foreignKey: 'quizId', 
//   as: 'statistics' 
// });


// // QuizStatistics pertence a um Quiz
// QuizStatistics.belongsTo(Quiz, { 
//   foreignKey: 'quizId', 
//   as: 'quiz' 
// });


// // User tem muitas QuizStatistics
// User.hasMany(QuizStatistics, { 
//   foreignKey: 'userId', 
//   as: 'quizStatistics' 
// });


// // QuizStatistics pertence a um User
// QuizStatistics.belongsTo(User, { 
//   foreignKey: 'userId', 
//   as: 'user' 
// });


// // Quiz tem muitas UserAttempts
// Quiz.hasMany(QuizUserAttempt, { 
//   foreignKey: 'quizId', 
//   as: 'userAttempts' 
// });


// // QuizUserAttempt pertence a um Quiz
// QuizUserAttempt.belongsTo(Quiz, { 
//   foreignKey: 'quizId', 
//   as: 'quiz' 
// });


// // User tem muitas QuizUserAttempts
// User.hasMany(QuizUserAttempt, { 
//   foreignKey: 'userId', 
//   as: 'quizAttempts' 
// });


// // QuizUserAttempt pertence a um User
// QuizUserAttempt.belongsTo(User, { 
//   foreignKey: 'userId', 
//   as: 'user' 
// });































// UnitEvaluationQuestion.ts
//UnitEvaluationQuestion.belongsTo(UnitEvaluation, { foreignKey: 'unitEvaluationId' });
//UnitEvaluation.hasMany(UnitEvaluationQuestion, { foreignKey: 'unitEvaluationId' });



//UnitEvaluationAnswer.belongsTo(User, { foreignKey: 'userId' });
//User.hasMany(UnitEvaluationAnswer, { foreignKey: 'userId' });

//UnitEvaluation.belongsTo(User, { foreignKey: 'evaluatedBy', as: 'evaluator' });
//User.hasMany(UnitEvaluation, { foreignKey: 'evaluatedBy', as: 'unitEvaluations' });





// INDIVIDUAL

// IndividualEvaluation.ts
//IndividualEvaluation.belongsTo(User, { foreignKey: 'userId' });
//User.hasMany(IndividualEvaluation, { foreignKey: 'userId' });

// IndividualEvaluationQuestion.ts
//IndividualEvaluationQuestion.belongsTo(IndividualEvaluation, { foreignKey: 'individualEvaluationId' });
//IndividualEvaluation.hasMany(IndividualEvaluationQuestion, { foreignKey: 'individualEvaluationId' });

// IndividualEvaluationAnswer.ts
//IndividualEvaluationAnswer.belongsTo(IndividualEvaluationQuestion, { foreignKey: 'questionId' });
//IndividualEvaluationQuestion.hasMany(IndividualEvaluationAnswer, { foreignKey: 'questionId' });

//IndividualEvaluationAnswer.belongsTo(User, { foreignKey: 'userId' });
//User.hasMany(IndividualEvaluationAnswer, { foreignKey: 'userId' });

// Exporta tudo
export { 
  sequelize, 
  User, 
  Unit, 
  UnitDbv, 
  RefreshToken, 
  UnitCounselor,
  UnitEvaluation, 
  UnitEvaluationQuestion, 
  UnitEvaluationAnswer, 
  IndividualEvaluation, 
  IndividualEvaluationQuestion, 
  IndividualEvaluationAnswer,
  UnitRanking
};














// import { Sequelize } from "sequelize";
// import * as config from '../config/config';

// export default new Sequelize(config);