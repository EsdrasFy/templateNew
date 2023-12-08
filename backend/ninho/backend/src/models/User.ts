import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profile_img: {
      type: DataTypes.STRING,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    shopping: {
      type: DataTypes.INTEGER,
      references: {
        model: "buy_product",
        key: "solicitation_id",
      },
    },
    gender: {
      type: DataTypes.STRING,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    cards: {
      type: DataTypes.INTEGER,
      references: {
        model: "credit_cards",
        key: "card_id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    messages: {
      type: DataTypes.INTEGER,
      references: {
        model: "notify_messages",
        key: "notify_id",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: "users",
  }
);

export default User;
