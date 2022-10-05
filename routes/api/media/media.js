const { Router } = require("express");
const mediaController = require("../../../controllers/media");
const upload = require("../../../middlewares/upload");
const uploadFile = require("../../../middlewares/uploadFile");

const router = Router();
const middleware = require("../../../middlewares/index");

router.get("/", middleware.login, mediaController.index);
router.post("/avatar/:id", upload.single("avatar"), middleware.login, mediaController.avatarUpload);
router.post(
  "/ebook-preview",
  uploadFile.single("ebook"),
  middleware.login,
  mediaController.fileUpload
);
router.post(
  "/book-images",
  upload.array("photos", 3),
  middleware.login,
  mediaController.imageUpload
);

module.exports = router;
