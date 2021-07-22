const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const selectedServices = new Schema({
  amountService: {
    type: Number,
    min: 1
  },
  totalService: {
    type: Double
  },
  idService: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  idFolioService: [{
    type: Schema.Types.ObjectId,
    ref: 'FolioService'
  }]
});

selectedServices.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const SelectedService = model('SelectedService', selectedServices);

module.exports = SelectedService;