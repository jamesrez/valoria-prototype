const express = require('express');
const app = express();

app.get('/', (req, res) => {

  res.send("Under Construction. Send inquiries to valoria.us@protonmail.com");

});

app.listen(process.env.PORT || '3000', () => {
  console.log("On");
});
