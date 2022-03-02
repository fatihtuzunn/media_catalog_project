const express = require('express');
const { sendfile } = require('express/lib/response');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');

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

app.use(methodOverride('_method', {
  methods:['POST','GET']
}))

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
  res.render('photo', {       //photo sayfasının son kullanıcı için renderla
    photo,                    // photo sayfasında photo değerine yukardaki const photo değişkenini ata. {photo:photo}
  });
});


app.get('/photos/edit/:id', async (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
  const photo = await Photo.findById(req.params.id);
  res.render('edit', { 
    photo, 
  });
});

app.put('/photos/edit/:photoId', async (req, res) =>{
await Photo.findByIdAndUpdate(req.params.photoId, {
  title: req.body.title,
  description: req.body.description


})
res.redirect(req.get('referer'));
})

// photo.ejsden yolladığımız delete methodunu yakalıyoruz
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({_id:req.params.id}); //silecegimiz fotografı databaseden bulduk photo constuna atadık
  let deletedImage= __dirname+'/public'+photo.image;      //fotografı klasör dizinimizden bulduk dizin yolumuzu deletedImage'e atadık
  fs.unlinkSync(deletedImage);                            //filesystem(fs) modülü sayesinde dizindeki fotografı sildik (işlem senkron olmalı)
  await Photo.findByIdAndRemove(req.params.id);           //databaseden fotograf documentini sildik

  
  res.redirect('/');
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
