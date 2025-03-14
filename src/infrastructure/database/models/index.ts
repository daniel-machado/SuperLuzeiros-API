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

// Object.values(models).forEach((model: any) => {
//   if(model.init){
//     model.init(sequelize);
//   }
// });


// Define os relacionamentos

// Relacionamento: Uma unidade tem vários conselheiros
Unit.hasMany(UnitCounselor, { foreignKey: 'unitId', as: 'counselors' });
// Relacionamento: Uma unidade tem vários desbravadores
Unit.hasMany(UnitDbv, { foreignKey: 'unitId', as: 'dbvs' });

UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });
UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });



// UNIT EVALUATIONS

// Define que uma(UnitEvaluation) pode ter várias respostas (UnitEvaluationAnswer).
UnitEvaluation.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitEvaluationId', as: 'answers' });
// significa que cada resposta (UnitEvaluationAnswer) pertence a uma única avaliação (UnitEvaluation).
UnitEvaluationAnswer.belongsTo(UnitEvaluation, { foreignKey: 'unitEvaluationId', as: 'evaluation' });

// Cada UnitEvaluation pertence a uma única Unit.
UnitEvaluation.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
//Uma Unit pode ter muitas UnitEvaluations associadas.
Unit.hasMany(UnitEvaluation, { foreignKey: 'unitId', as: 'evaluations' });

// Uma resposta pertence a um usuário
UnitEvaluationAnswer.belongsTo(Unit, { foreignKey: 'unitId', as: "unitAnswerToUnit" });
// Um usuário pode ter várias respostas
Unit.hasMany(UnitEvaluationAnswer, { foreignKey: 'unitId', as: "unitToAnswer" });


// Uma pergunta pode ter várias respostas
UnitEvaluationQuestion.hasMany(UnitEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswers" });
// Uma resposta pertence a uma única pergunta
UnitEvaluationAnswer.belongsTo(UnitEvaluationQuestion, { foreignKey: 'questionId', as: "unitAnswers" });

//Cada ranking pertence a uma única unidade
UnitRanking.belongsTo(Unit, { 
  foreignKey: 'unitId', 
  as: 'unitRank' 
});
// Uma unidade por ter vários rankings
Unit.hasMany(UnitRanking, { 
  foreignKey: 'unitId', 
  as: 'unitRankings' 
});

//Cada ranking pertence a uma única user
IndividualRanking.belongsTo(User, { 
  foreignKey: 'dbvId', 
  as: 'individualRank' 
});
// Uma unidade por ter vários rankings
User.hasMany(IndividualRanking, { 
  foreignKey: 'dbvId', 
  as: 'individualRankings' 
});



// Individual Evaluation

// Define que uma(UnitEvaluation) pode ter várias respostas (UnitEvaluationAnswer).
IndividualEvaluation.hasMany(IndividualEvaluationAnswer, { foreignKey: 'individualEvaluationId', as: 'Individualanswers' });
// significa que cada resposta (UnitEvaluationAnswer) pertence a uma única avaliação (UnitEvaluation).
IndividualEvaluationAnswer.belongsTo(IndividualEvaluation, { foreignKey: 'individualEvaluationId', as: 'Individualevaluation' });

// Uma pergunta pode ter várias respostas
IndividualEvaluationQuestion.hasMany(IndividualEvaluationAnswer, { foreignKey: 'questionId', as: "questionAnswersIndividual" });
// Uma resposta pertence a uma única pergunta
IndividualEvaluationAnswer.belongsTo(IndividualEvaluationQuestion, { foreignKey: 'questionId', as: "EvaluationIndividualQuestion" });

// Uma resposta pertence a um usuário
IndividualEvaluationAnswer.belongsTo(User, { foreignKey: 'userId', as: "individualAnswerToUser" });
// Um usuário pode ter várias respostas
User.hasMany(IndividualEvaluationAnswer, { foreignKey: 'userId', as: "individualUserToAnswer" });

// Cada UnitEvaluation pertence a uma única Unit.
IndividualEvaluation.belongsTo(User, { foreignKey: 'userId', as: 'usersEvaluation' });
//Uma Unit pode ter muitas UnitEvaluations associadas.
User.hasMany(IndividualEvaluation, { foreignKey: 'userId', as: 'evaluationsUser' });




// Cada UserSpecialty pertence a um unicio User.
UserSpecialty.belongsTo(User, { foreignKey: 'userId', as: 'specialtyUser' });
//Um user pode ter muitas UserSpecialty associadas.
User.hasMany(UserSpecialty, { foreignKey: 'userId', as: 'userSpecialties' });

// Relacionamento com Specialty
UserSpecialty.belongsTo(Specialty, {foreignKey: 'specialtyId', as: 'specialtyInfo'});


// Cada UserSpecialty pertence a um unicio User.
UserClass.belongsTo(User, { foreignKey: 'userId', as: 'classUser' });
//Um user pode ter muitas UserSpecialty associadas.
User.hasMany(UserClass, { foreignKey: 'userId', as: 'userClass' });

// Relacionamento com Specialty
UserClass.belongsTo(Class, {foreignKey: 'classId', as: 'classInfo'});




QuizQuestion.hasMany(QuizAnswer, { foreignKey: "questionId", as: "quizAnswers"});
QuizAnswer.belongsTo(QuizQuestion, { foreignKey: "questionId", as: "quizquestion" });




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