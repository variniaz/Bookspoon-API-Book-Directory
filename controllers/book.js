require("dotenv").config();
const { Book, Images } = require("../models");
const Validator = require("fastest-validator");
const V = new Validator();
const { Op } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    try {
      const schema = {
        title: "string|required",
        description: "string",
        published_year: "number|required",
        pages: "number|required",
        genre: "string|required",
        author: "string|required",
        isbn: "number|required",
      };

      const validator = V.validate(req.body, schema);
      if (validator.length) {
        return res.sendBadRequest("bad request schema");
      }

      const isBookExist = await Book.findOne({
        where: {
          isbn: req.body.isbn,
        },
      });

      if (isBookExist) {
        return res.sendBadRequest("book already exist.");
      }

      const newBook = await Book.create({
        ...req.body,
        user_id: req.user.id,
      });

      return res.sendDataCreated("success create a new book", {
        id: newBook.id,
        title: newBook.title,
        description: newBook.description,
        published_year: newBook.published_year,
        pages: newBook.pages,
        genre: newBook.genre,
        author: newBook.author,
        isbn: newBook.isbn,
        book_images: null,
        ebook_preview: null,
        createdAt: newBook.createdAt,
        updatedAt: newBook.updatedAt,
      });
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  findAll: async (req, res) => {
    try {
      const books = await Book.findAll();
      if (books.length === 0) {
        return res.sendNotFound("Buku tidak ditemukan.");
      }

      res.sendJson(200, true, "success find all data", books);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  index: async (req, res) => {
    try {
      let keyword = req.query.keyword;

      const search = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: "%" + keyword + "%" } },
            { author: { [Op.iLike]: "%" + keyword + "%" } },
            { genre: { [Op.iLike]: "%" + keyword + "%" } },
          ],
        },
      });

      if (search.length === 0) {
        return res.sendNotFound("Buku tidak ditemukan");
      }

      return res.sendJson(200, true, "success search book", search);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  indexById: async (req, res) => {
    try {
      const book_id = req.params.id;

      const book = await Book.findOne({
        where: {
          id: book_id,
        },
        include: [{ model: Images, as: "bookImages" }],
      });

      if (!book) {
        return res.sendNotFound("id book not found");
      }

      return res.sendJson(200, true, "success get data book", book);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  update: async (req, res) => {
    try {
      const currentUser = req.user.id;
      const book_id = req.params.id;

      const checkOwnerBook = await Book.findOne({
        where: {
          user_id: currentUser,
        },
      });

      if (currentUser.id !== checkOwnerBook.user_id) {
        return res.sendNotFound("you're not allowed to edit this book");
      }

      const {
        title,
        description,
        published_year,
        pages,
        genre,
        author,
        isbn,
        book_images,
      } = req.body;

      const bookId = {
        where: {
          id: book_id,
        },
      };

      const updated = await Book.update(
        {
          title,
          description,
          published_year,
          pages,
          genre,
          author,
          isbn,
          book_images,
        },
        bookId
      );

      res.sendJson(200, true, "success update book", updated);

      if (updated == 0) {
        return res.sendNotFound("id data book not found");
      }
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
  delete: async (req, res) => {
    try {
      const currentUser = req.user.id;
      const book_id = req.params.id;

      const checkOwnerBook = await Book.findOne({
        where: {
          user_id: currentUser,
        },
      });

      if (currentUser.id !== checkOwnerBook.user_id) {
        return res.sendNotFound("you're not allowed to delete this book");
      }

      const deleted = await Book.destroy({
        where: {
          id: book_id,
        },
      });

      if (!deleted) {
        return res.sendNotFound("id data book not found");
      }

      res.sendJson(200, true, "success delete data book", deleted);
    } catch (err) {
      return res.sendServerError(err.message);
    }
  },
};
