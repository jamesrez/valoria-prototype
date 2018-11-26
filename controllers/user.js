const User = require('../models/user');
const jwt = require('jsonwebtoken');


module.exports = (app) => {

  app.post('/register', (req, res) => {
    User.findOne({username : req.body.username}).then((user) => {
      if(user){
        res.send({err : "User Already Exists"});
      }else{
        let newUser = new User;
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.avatars.push({
          key : "Valorian",
          src : "https://i.imgur.com/MgPq7Fn.png"
        })
        newUser.objects.push({
          key : "Love",
          src : "https://i.imgur.com/U7WCZuu.png"
        });
        newUser.backgrounds.push({
          key : "Purple Grid",
          src : "https://i.imgur.com/a4ycklR.png"
        })
        newUser.save((err, user) => {
          // generate a JWT for this user from the user's id and the secret key
          let token = jwt.sign({
            id: user._id,
            username : user.username,
            avatars : user.avatars,
            objects : user.objects,
            backgrounds : user.backgrounds
          }, process.env.JWT_SECRET, { expiresIn: "60 days"});
          res.cookie('userToken', token);
          res.redirect('/');
        });
      }
    })
  });

  app.post('/login', (req, res) => {
    User.findOne({username : req.body.username}).then((user) => {
      if(!user){
        res.send({err : "Username does not exist" });
      }
      else if(!user.validPassword(req.body.password)){
        res.send({err : "Incorrect Password" });
      }else{
        // generate a JWT for this user from the user's id and the secret key
        let token = jwt.sign({
          id: user._id,
          username : user.username,
          avatars : user.avatars,
          objects : user.objects,
          backgrounds : user.backgrounds
        }, process.env.JWT_SECRET, { expiresIn: "60 days"});
        res.cookie('userToken', token);
        res.redirect('/');
      }
    })
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.send();
  })

}
