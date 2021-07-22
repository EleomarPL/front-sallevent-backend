const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const servicesSchedule = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  detail: {
    type: String,
    minlength: 2,
    maxlength: 300
  },
  price: {
    type: Double
  }
});

servicesSchedule.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Service = model('Service', servicesSchedule);

module.exports = Service;