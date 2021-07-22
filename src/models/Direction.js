const {Schema, model} = require('mongoose');

const directionSchema = new Schema({
  street: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  state: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  municipality: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  suburb: {
    type: String,
    minlength: 2,
    maxlength: 45
  }
});

directionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Direction = model('Direction', directionSchema);

module.exports = Direction;