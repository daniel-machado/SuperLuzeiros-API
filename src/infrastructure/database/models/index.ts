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