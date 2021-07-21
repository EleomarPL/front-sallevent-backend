const mongoose = require('mongoose');

const stringConnection = process.env.MONGODB_URI;

mongoose.connect(stringConnection, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).
  then( () => {
    console.log('conectado');
  }).catch( err => {
    console.err(err);
  });