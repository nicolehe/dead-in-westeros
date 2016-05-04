var express = require('express');
var app = express();

app.use(express.static('public'));


app.listen(process.env.PORT, function() {
  console.log('listening on port 3000');
});