const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, './client/assets/uploads');
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload = multer({ storage : storage })

module.exports = (app) => {

  app.post('/upload', upload.single('upload'), (req, res) => {
    console.log(req.file);
  })

}
