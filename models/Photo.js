const mongoose = require('mongoose');
//schema oluşturuyoruz sablon
const Schema = mongoose.Schema;

//title ve descının saklandığı PhotoScheme yapısı
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String, //dosya yolunu kaydediyoruz
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);


module.exports=Photo;