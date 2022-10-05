const { imagekit } = require("../helpers");
const { Images, User, Book } = require("../models");
const Validator = require("fastest-validator");
const V = new Validator();

module.exports = {
  index: async (req, res) => {
    try {
      const data = await Images.findAll({ order: [["id"]] });

      return res.sendJson(200, true, "success get all data image", data);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },

  avatarUpload: async (req, res) => {
    try {
      const user_id = req.params.id;
      // const user_id = req.user.id;
      const file = req.file.buffer.toString("base64");
      const namaFile = Date.now() + "-" + req.file.originalname;

      const upload = await imagekit.upload({
        file: file,
        fileName: namaFile,
      });

      const userId = {
        where: {
          id: user_id,
        },
      };

      const image = await User.update(
        {
          avatar: upload.url,
        },
        userId
      );

      return res.sendJson(200, true, "success", image);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },

  imageUpload: async (req, res) => {
    try {
      let images = [];

      const book_id = req.body.book_id;

      const schema = {
        book_id: { type: "string" },
      };

      const validator = V.validate(req.body, schema);
      if (validator.length) {
        return res.sendBadRequest("please insert book_id");
      }

      //* check available book id
      const checkBook = await Book.findOne({
        where: {
          id: book_id,
        },
      });

      if (!checkBook) {
        return res.sendNotFound("id data book not found");
      }

      for (element of req.files) {
        const file = element.buffer.toString("base64");
        const namaFile = Date.now() + "-" + element.originalname;

        const upload = await imagekit.upload({
          file: file,
          fileName: namaFile,
        });

        const image = await Images.create({
          image_url: upload.url,
          book_id: book_id,
        });
        images.push({
          id: image.id,
          url: image.image_url,
        });
      }

      return res.sendJson(200, true, "success", images);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  fileUpload: async (req, res) => {
    try {
      const book_id = req.body.book_id;
      const file = req.file.buffer.toString("base64");
      const namaFile = Date.now() + "-" + req.file.originalname;

      const upload = await imagekit.upload({
        file: file,
        fileName: namaFile,
      });

      const bookId = {
        where: {
          id: book_id,
        },
      };

      const bookPreview = await Book.update(
        {
          ebook_preview: upload.url,
        },
        bookId
      );

      return res.sendJson(200, true, "success", bookPreview);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
};
