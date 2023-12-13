const multer = require("multer");
const uuid = require("uuid").v4

const upload = multer({
  storage: multer.diskStorage({
    destination: "data/product-images",
    filename: (req, file, cb) => {
        cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

const multerConfig = upload.single("image");

module.exports = multerConfig;
