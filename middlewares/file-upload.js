const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: "data/product-images",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.fieldname + file.originalname);
    },
  }),
});

const multerConfig = upload.single("image");

module.exports = multerConfig;
