const {connect} = require('mongoose');

const stringConnection = process.env.MONGODB_URI;

connect(stringConnection).
  then( () => {
    console.log('conectado');
  }).catch( err => {
    console.log(err);
  });