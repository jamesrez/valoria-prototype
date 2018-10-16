const Multer  = require('multer')
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'valoria-219021'
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});


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
  // bucket.getFiles((err, files) => {
  //   files.forEach((file) => {
  //     console.log(file.metadata.selfLink);
  //   })
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
        blob.move(`main/${req.file.originalname}`, (err, file, res) => {
          if(err){
            console.log(err);
          }else{
            file.makePublic((err) => {
              let publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
              console.log(publicUrl);
            });
          }
        })
      });
      blobStream.end(req.file.buffer);
    }
  })

}
