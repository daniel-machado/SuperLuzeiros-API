// models/unit.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export interface IUnitAttributes {
  id?: number;
  name: string;
  photo?: string;
}

export class Unit extends Model {
  public id!: number;
  public name!: string;
  public photo!: string;
}
// Definição da tabela units
Unit.init(
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
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'units',
    timestamps: true,
  }
);

// // Relacionamentos
// Unit.hasMany(UnitCounselor, { foreignKey: 'unitId', as: 'counselors' });
// Unit.hasMany(UnitDbv, { foreignKey: 'unitId', as: 'dbvs' });

// UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });
// UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });




// // models/unit.model.ts

// import { Model, DataTypes, Optional } from 'sequelize';
// import sequelize from '../sequelize'; 
// import { User } from './User'; 
// import { UnitCounselor } from './UnitCounselor'; 
// import { UnitDbv } from './UnitDbv'

// export interface IUnitAttributes {
//   id?: number;
//   name: string;
//   photo?: string;
// }

// export interface UnitCreationAttributes extends Optional<IUnitAttributes, 'id'> {}

// export class Unit extends Model<IUnitAttributes, UnitCreationAttributes> implements IUnitAttributes {
//   public id!: number;
//   public name!: string;
//   public photo?: string;

//   // Relacionamentos
//   public counselors?: User[]; // Relacionamento com conselheiros
//   public dbvs?: User[]; // Relacionamento com desbravadores

//   // Timestamps
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// // Definir o modelo de Unidade no Sequelize
// Unit.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     photo: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'units',
//     timestamps: true,
//   }
// );

// // 🔹 Relacionamento correto com conselheiros
// Unit.belongsToMany(User, {
//   through: UnitCounselor, 
//   as: 'counselors',
//   foreignKey: 'unitId',
//   otherKey: 'userId',
// });

// // 🔹 Relacionamento correto com desbravadores
// Unit.belongsToMany(User, {
//   through: UnitDbv, 
//   as: 'dbvs',
//   foreignKey: 'unitId',
//   otherKey: 'userId',
// });