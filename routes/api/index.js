var express = require("express");
var router = express.Router();

const authRouter = require("./auth");
const booksRouter = require("./books");
const userRouter = require("./users");
const mediaRouter = require("./media");
const passport = require("../../lib/passport");

router.use(passport.initialize());
router.use("/auth", authRouter);
router.use("/books", booksRouter);
router.use("/users", userRouter);
router.use("/media", mediaRouter);

module.exports = router;
