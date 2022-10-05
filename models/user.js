"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Book, { foreignKey: "user_id", as: "owner" });
    }
    static authenticate = async ({ email, password }) => {
      try {
        const user = await User.findOne({
          where: {
            email: email,
          },
        });
        if (!user) return Promise.reject(new Error("user not found!"));

        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid)
          return Promise.reject(new Error("wrong password!"));

        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
        email: this.email,
      };

      const secretKey = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secretKey);
      return token;
    };

    checkPassword = (password) => {
      return bcrypt.compareSync(password, this.password);
    };
  }
  User.init(
    {
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
