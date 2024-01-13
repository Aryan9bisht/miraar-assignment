const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/product_management');
const db = mongoose.connection;
db.on('error', console.error.bind(console,'error in connecting to db'));
db.once('open',function(){
    console.log('db connected ');
})
module.exports= db;
