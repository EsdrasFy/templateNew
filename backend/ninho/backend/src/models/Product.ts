import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantidy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sizes: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    guarantee: {
      type: DataTypes.STRING,
    },
    variation: {
      type: DataTypes.STRING,
    },
    assessment: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    parcelable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    max_installments: {
      type: DataTypes.INTEGER,
    },
    interest_rate: {
      type: DataTypes.DOUBLE,
    },
    update_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    cor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "colors",
        key: "colors_id",
      },
    },
    promotion: {
      type: DataTypes.INTEGER,
      references: {
        model: "promos",
        key: "promos_id",
      },
    },
    classe: {
      type: DataTypes.STRING
    }
  },
  {
    underscored: true,
    tableName: "product",
  }
);

export default Product;
