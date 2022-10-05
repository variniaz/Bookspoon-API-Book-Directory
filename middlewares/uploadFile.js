const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "application/pdf") {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("only pdf allowed to upload!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = upload;
