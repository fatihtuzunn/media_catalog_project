const express = require('express');
const { sendfile } = require('express/lib/response');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();

//connect db
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Template ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public')); //static files
// bu sayede tüm css dosyaları fotografları falan çektik.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

//verileri database e kaydediyoruz
app.post('/photos', async function (req, res) {
  
     //await Photo.create(req.body);
    //res.redirect('/');

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});




//verileri databaseden çekiyoruz
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  });
});

/* const myLogger = function (req, res, next) {
  console.log('logging')
  next()
}

app.use(myLogger) */

//ROUTES
app.get('/', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
  res.render('index');
});

app.get('/about', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
  res.render('about');
});

app.get('/add', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
  res.render('add');
});

app.get('/photo', (req, res) => {
  res.render('photo');
});

//Route parameters
app.get('/photos/:photoId', async (req, res) => {
  const photo = await Photo.findById(req.params.photoId);
  res.render('photo', {
    photo,
  });
});

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
