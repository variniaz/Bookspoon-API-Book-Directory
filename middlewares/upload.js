const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("only png, jpg, and jpeg allowed to upload!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = upload;
