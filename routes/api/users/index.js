const { Router } = require("express");
const userRouter = require("./user");

const router = Router();

router.use(userRouter); // /login, /logout, /register

module.exports = router;
