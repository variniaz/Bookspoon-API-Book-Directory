require("dotenv").config();
const { User } = require("../models");
const Validator = require("fastest-validator");
const V = new Validator();
const { Op } = require("sequelize");

module.exports = {
  findAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {exclude: ['password']}
      });
      if (users.length === 0) {
        return res.sendNotFound("Buku tidak ditemukan.");
      }

      res.sendJson(200, true, "success find all data", users);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  index: async (req, res) => {
    try {
      let keyword = req.query.keyword;

      const search = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: "%" + keyword + "%" } },
            { name: { [Op.iLike]: "%" + keyword + "%" } },
          ],
        },
      });

      if (search.length === 0) {
        return res.sendNotFound("User tidak ditemukan");
      }

      return res.sendJson(200, true, "success search user", search);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  show: async (req, res) => {
    try {
      const user_id = req.params.id;

      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        return res.sendNotFound("id user not found");
      }
      const showUser = {
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      return res.sendJson(200, true, "success get data user", showUser);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  update: async (req, res) => {
    try {
      const currentUser = req.user;
      const { username, name, email, password } = req.body;

      const user = await User.findOne({ where: { id: currentUser.id } });
      if (!user) {
        return res.sendNotFound("user not found");
      }

      const userId = {
        where: {
          id: currentUser.id,
        },
      };

      const updatedUser = await User.update(
        {
          username,
          name,
          email,
          password,
        },
        userId
      );

      if (updatedUser == 0) {
        return res.sendNotFound("field not found");
      }
      return res.sendJson(200, true, "success update user", updatedUser);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  delete: async (req, res) => {
    try {
      const user_id = req.params.id;

      const deleted = await User.destroy({
        where: {
          id: user_id,
        },
      });

      if (!deleted) {
        return res.sendNotFound("id data user not found");
      }

      res.sendJson(200, true, "success delete data user", deleted);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
};
