"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.User, { foreignKey: "user_id", as: "owner" });
      Book.hasMany(models.Images, {
        foreignKey: "book_id",
        as: "bookImages",
      });
    }
  }
  Book.init(
    {
      user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      published_year: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      genre: DataTypes.STRING,
      author: DataTypes.STRING,
      isbn: DataTypes.BIGINT,
      book_images: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ebook_preview: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
