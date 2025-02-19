import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';
export class UnitCounselor extends Model {
  public id!: number;
  public unitId!: number;
  public userId!: number;
}

UnitCounselor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,     
    },
    unitId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,     
      references: { 
        model: Unit, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,     
      references: { 
        model: User, 
        key: 'id' 
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'UnitCounselor',
    tableName: 'unit_counselors',
    timestamps: false,
  }
);

// // Relacionamento com o modelo Unit e User
// UnitCounselor.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
// UnitCounselor.belongsTo(User, { foreignKey: 'userId', as: 'counselor' });








// // models/unitCounselor.model.ts
// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../sequelize';
// import { Unit } from './Unit';
// import { User } from './User';

// export class UnitCounselor extends Model {
//   public unitId!: number;
//   public userId!: number;
// }

// UnitCounselor.init(
//   {
//     unitId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Unit,
//         key: 'id',
//       },
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User,
//         key: 'id',
//       },
//     },
//   },
//   { 
//     sequelize, 
//     tableName: 'unit_counselors',
//     timestamps: false, // Não precisamos de createdAt e updatedAt nesta tabela 
//     }
// );


// // // models/unitCounselor.model.ts

// // import { DataTypes, Model } from 'sequelize';
// // import sequelize from '../sequelize'; // Ajuste para o caminho correto

// // export class UnitCounselor extends Model {
// //   public unitId!: number;
// //   public userId!: number;
// // }

// // UnitCounselor.init(
// //   {
// //     unitId: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'units',
// //         key: 'id',
// //       },
// //     },
// //     userId: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'users',
// //         key: 'id',
// //       },
// //     },
// //   },
// //   {
// //     sequelize,
// //     tableName: 'UnitCounselors',
// //     timestamps: false, // Não precisamos de createdAt e updatedAt nesta tabela
// //   }
// // );

