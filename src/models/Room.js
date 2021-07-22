const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const roomSchedule = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  capacity: {
    type: Number,
    min: 1
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 300
  },
  priceHour: {
    type: Double
  },
  idInfo: [{
    type: Schema.Types.ObjectId,
    ref: 'InfoRoom'
  }]
});

roomSchedule.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Room = model('Room', roomSchedule);

module.exports = Room;