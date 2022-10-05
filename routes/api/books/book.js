const { Router } = require("express");
const bookController = require("../../../controllers/book");

const router = Router();
const middleware = require("../../../middlewares/index");

router.post("/", middleware.login, bookController.create);
router.put("/:id", middleware.login, bookController.update);
router.delete("/:id", middleware.login, bookController.delete);

//no auth
router.get("/", bookController.findAll);
router.get("/search", bookController.index);
router.get("/:id", bookController.indexById);

module.exports = router;
