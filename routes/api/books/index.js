const { Router } = require("express");
const bookRouter = require("./book");

const router = Router();

router.use(bookRouter); // /login, /logout, /register

module.exports = router;
