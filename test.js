/* const mongoose = require('mongoose');
//schema oluşturuyoruz sablon
const Schema = mongoose.Schema;
//connect db
mongoose.connect('mongodb://localhost//pcat-test-db');

//title ve descının saklandığı PhotoScheme yapısı
const PhotoSchema = new Schema({
title:String,
description:String,
});

const Photo = mongoose.model('Photo', PhotoSchema);

//her sey hazır artık veri olusturabiliriz
Photo.create({
title:'Photo Title 1',
description:'Photo desc...',

})
 */