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


  app.post('/upload/avatar', multer.single('upload'), (req, res) => {
    if(!req.file){
      console.log("No file");
    }else{
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on('error', (err) => {
        console.log(err);
      });
      blobStream.on('finish', () => {
        blob.setMetadata({metadata : {key : req.file.originalname}}, () => {
          blob.move(`main/avatar/${req.file.originalname}`, (err, file, apiRes) => {
            if(err){
              console.log(err);
            }else{
              file.makePublic((err) => {
                let publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                res.send({
                  src : publicUrl,
                  key : req.file.originalname
                });
              });
            }
          })
        });
      });
      blobStream.end(req.file.buffer);
    }
  })

  app.post('/upload/object', multer.single('upload'), (req, res) => {
    if(!req.file){
      console.log("No file");
    }else{
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on('error', (err) => {
        console.log(err);
      });
      blobStream.on('finish', () => {
        blob.setMetadata({metadata : {key : req.file.originalname}}, () => {
          blob.move(`main/object/${req.file.originalname}`, (err, file, apiRes) => {
            if(err){
              console.log(err);
            }else{
              file.makePublic((err) => {
                let publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                res.send({
                  src : publicUrl,
                  key : req.file.originalname
                });
              });
            }
          })
        });
      });
      blobStream.end(req.file.buffer);
    }
  });

  app.post('/upload/background', multer.single('upload'), (req, res) => {
    if(!req.file){
      console.log("No file");
    }else{
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on('error', (err) => {
        console.log(err);
      });
      blobStream.on('finish', () => {
        blob.setMetadata({metadata : {key : req.file.originalname}}, () => {
          blob.move(`main/background/${req.file.originalname}`, (err, file, apiRes) => {
            if(err){
              console.log(err);
            }else{
              file.makePublic((err) => {
                let publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                res.send({
                  src : publicUrl,
                  key : req.file.originalname
                });
              });
            }
          })
        });
      });
      blobStream.end(req.file.buffer);
    }
  })


}
