const User = require('../models/user');
const jwt = require('jsonwebtoken');


module.exports = (app) => {

  app.post('/register', (req, res) => {
    User.findOne({username : req.body.username}).then((user) => {
      if(user){
        res.status(400).send("User Already Exists");
      }else{
        let newUser = new User;
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.save((err, user) => {
          // generate a JWT for this user from the user's id and the secret key
          let token = jwt.sign({
            id: user._id,
            username : user.username
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
        res.status(400).send("User does not exist");
      }
      else if(!user.validPassword(req.body.password)){
        res.status(400).send("Incorrect Password");
      }else{
        // generate a JWT for this user from the user's id and the secret key
        let token = jwt.sign({
          id: user._id,
          username : user.username
        }, process.env.JWT_SECRET, { expiresIn: "60 days"});
        res.cookie('userToken', token);
        res.redirect('/');
      }
    })
  })

}
