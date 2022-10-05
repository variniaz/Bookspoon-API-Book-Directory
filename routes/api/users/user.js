const { Router } = require("express");
const userController = require("../../../controllers/user");

const router = Router();
const middleware = require("../../../middlewares/index");

router.get("/", userController.findAll);
router.get("/search", userController.index);
router.get("/:id", userController.show);

//with auth
router.put("/:id", middleware.login, userController.update);
router.delete("/:id", middleware.admin, userController.delete);

module.exports = router;
