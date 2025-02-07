import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

// Definindo a interface para os atributos de um usuário
export interface IRefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

// A interface para a criação do usuário (sem o id e sem createdAt e updatedAt, pois são gerados automaticamente)
export interface IRefreshTokenCreationAttributes extends Optional<IRefreshToken, 'id'> {}

export class RefreshToken extends Model<IRefreshToken, IRefreshTokenCreationAttributes> {
  public id!: string;
  public userId!: string;
  public token!: string;
  public expiresAt!: Date;
}

RefreshToken.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    userId: { 
      type: DataTypes.UUID, 
      allowNull: false 
    },
    token: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    expiresAt: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
  },
  { 
    sequelize, 
    tableName: "refresh_tokens", 
    timestamps: false 
  }
);
