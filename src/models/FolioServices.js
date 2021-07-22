const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const folioServices = new Schema({
  totalServices: {
    type: Double
  }
});

folioServices.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const FolioService = model('FolioService', folioServices);

module.exports = FolioService;