const multer = require('multer');

class UploadMiddleware {
  upload = null;

  constructor(folderPath, filePath) {
    this.folderPath = folderPath;
    this.filePath = filePath;

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, folderPath);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });

    this.upload = multer({
      storage: storage
    });
  }

  uploadUserImage() {
    return this.upload.single(this.filePath);
  }

  uploadAssignments(total = 5) {
    return this.upload.array(this.filePath, total);
  }
}

module.exports = (folderPath, filePath) =>
  new UploadMiddleware(folderPath, filePath);
