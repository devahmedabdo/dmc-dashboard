const multer = require("multer");

const upload = multer({
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});

module.exports = upload;
