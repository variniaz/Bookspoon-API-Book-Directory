require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const V = new Validator();
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        username: "string|required",
        name: "string|required",
        email: "email|required",
        password: "string|required|min:7",
      };

      const validator = V.validate(req.body, schema);
      if (validator.length) {
        return res.sendBadRequest("bad request schema");
      }

      const isEmailExist = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (isEmailExist) {
        return res.sendBadRequest(
          "email already exist, please use another email"
        );
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        role: 1,
        avatar: null,
      });

      return res.sendDataCreated("success create a new user", {
        id: newUser.id,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  login: async (req, res) => {
    try {
      const schema = {
        email: "email|required",
        password: "string|required",
      };

      const validated = V.validate(req.body, schema);
      if (validated.length) {
        return res.status(400).json({
          status: false,
          message: "bad request!",
          data: validated,
        });
      }

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user not found",
          data: null,
        });
      }

      const passwordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCorrect) {
        return res.status(400).json({
          status: false,
          message: "wrong password",
          data: null,
        });
      }

      const data = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(data, JWT_SECRET_KEY);

      res.status(200).json({
        status: true,
        message: "ok",
        data: {
          ...data,
          token,
        },
      });
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },

  logout: async (req, res) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      // console.log("decoded => ", decoded);

      jwt.sign(decoded, JWT_TOKEN, {
        expiresIn: 1,
      });

      res.status(200).json({
        status: true,
        message: "success logout user",
      });

    } catch (err) {
      console.log(err);
      if (err.message == "jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },
};
