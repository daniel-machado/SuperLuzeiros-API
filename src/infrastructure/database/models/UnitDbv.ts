// // models/unitDbv.model.ts
import { DataTypes, Model, Optional} from 'sequelize';
import sequelize from '../sequelize';
import { Unit } from './Unit';
import { User } from './User';

export interface IUnitDbv {
  id: string;
  unitId?: string;
  userId?: string;
}

export interface IUnitDbvAttributes extends Optional<IUnitDbv, 'id'> {}

export class UnitDbv extends Model<IUnitDbv, IUnitDbvAttributes > {
  public id!: number;
  public unitId!: number;
  public userId!: number;
}

UnitDbv.init(
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
    modelName: 'UnitDbv',
    tableName: 'unit_dbvs',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["unitId", "userId"], // 🔹 Cria o índice único necessário
      },
    ],
  }
);

// // Relacionamento com o modelo Unit e User
// UnitDbv.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
// UnitDbv.belongsTo(User, { foreignKey: 'userId', as: 'dbv' });





// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../sequelize';
// import { Unit } from './Unit';
// import { User } from './User';

// export class UnitDbv extends Model {
//   public unitId!: number;
//   public userId!: number;
// }

// UnitDbv.init(
//   {
//     unitId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Unit,
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//       allowNull: false,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: User,
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//       allowNull: false,
//     },
//   },
//   { 
//     sequelize, 
//     tableName: 'unit_dbvs',
//     timestamps: false, // Não precisamos de createdAt e updatedAt nesta tabela
//   }
// );


// // models/unitDbv.model.ts

// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../sequelize';

// export class UnitDbv extends Model {
//   public unitId!: number;
//   public userId!: number;
// }

// UnitDbv.init(
//   {
//     unitId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'units',
//         key: 'id',
//       },
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'UnitDbvs',
//     timestamps: false, // Não precisamos de createdAt e updatedAt nesta tabela
//   }
// );
