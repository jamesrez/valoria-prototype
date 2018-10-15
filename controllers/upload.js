const Multer  = require('multer')
const sprite = require('node-sprite');
const {Storage} = require('@google-cloud/storage');
const MulterGoogleCloudStorage = require('multer-google-storage')

const storage = new Storage({
  projectId: '210513905515'
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});


var gifFrames = require('gif-frames');
var fs = require('fs');

module.exports = (app) => {

  // gifFrames({ url: './client/assets/uploads/doggy.gif', frames: 'all', type: 'png' }).then(function (frameData) {
  //   frameData.forEach(function (frame) {
  //     frame.getImage().pipe(fs.createWriteStream(
  //       '/client/assets/uploads/doggy/image-' + frame.frameIndex + '.png'
  //     ));
  //   });
  // });

  let bucket = storage.bucket('valoria');
  // myBucket.upload('./client/assets/uploads/doggy.gif', {
  //   gzip: true,
  //   metadata: {
  //     cacheControl: 'public, max-age=31536000',
  //   },
  // }).then((data) => {
  //   console.log(data)
  // }).catch((err) => {
  //   console.log(err);
  // })

  app.post('/upload', multer.single('upload'), (req, res) => {
    if(!req.file){
      console.log("No file");
    }else{
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on('error', (err) => {
        console.log(err);
      });
      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log(publicUrl);
      });
      blobStream.end(req.file.buffer);
    }
  })

}
