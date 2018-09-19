const express = require('express');
const app = express();

app.set('views', './client')
app.set('view engine', 'pug');
app.use('/client', express.static('public'))
app.use('/client/styles', express.static(__dirname + '/client/styles'));
app.use('/client/scripts', express.static(__dirname + '/client/scripts'));
app.use('/client/assets', express.static(__dirname + '/client/assets'));

app.get('/', (req, res) => {

  res.render('main');

});

app.listen(process.env.PORT || '3000', () => {
  console.log("On");
});
