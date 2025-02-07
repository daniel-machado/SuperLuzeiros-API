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


// Define os relacionamentos

// Relacionamento: Uma unidade tem vários conselheiros
Unit.hasMany(UnitCounselor, { foreignKey: 'unitId', as: 'counselors' });

// Relacionamento: Uma unidade tem vários desbravadores
Unit.hasMany(UnitDbv, { foreignKey: 'unitId', as: 'dbvs' });

UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });
UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });


// Exporta tudo
export { sequelize, User, Unit, UnitDbv, RefreshToken, UnitCounselor };


// import { Sequelize } from "sequelize";
// import * as config from '../config/config';

// export default new Sequelize(config);