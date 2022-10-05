var express = require("express");
var router = express.Router();

const apiRouter = require("./api");

// router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/api", apiRouter);
router.get("/api", (req, res) => {
  res.sendJson(200, true, "Welcome to homepage");
});

module.exports = router;
