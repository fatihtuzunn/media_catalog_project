const express = require('express');
const { sendfile } = require('express/lib/response');
const path = require('path');

const app = express();

/* const myLogger = function (req, res, next) {
  console.log('logging')
  next()
}

app.use(myLogger) */

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'pages/index.html'));
});

app.use(express.static('public')); //static files
// bu sayede tüm css dosyaları fotografları falan çektik.

/* app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: 'Photo name',
    description: 'Photo desc.',
  };

  res.send(photo);
}); */

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
