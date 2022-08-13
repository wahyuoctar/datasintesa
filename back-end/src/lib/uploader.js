const { nanoid } = require("nanoid");
const multer = require("multer");

const fileUploader = ({
  destinationFolder = "avatar",
  prefix = "AVATAR",
  fileType = "image",
}) => {
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const filename = `${prefix}_${nanoid()}.rar`;
      cb(null, filename);
    },
  });
  const uploader = multer({
    storage: storageConfig,
    fileFilter: (req, file, cb) => {
      console.log(file);

      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      }

      cb(null, true);
    },
  });

  return uploader;
};

module.exports = fileUploader;
