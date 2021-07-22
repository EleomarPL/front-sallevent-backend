const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const reservationsSchedule = new Schema({
  typeEvent: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  statusReservation: {
    type: Number,
    min: 0,
    max: 2
  },
  priceTotal: {
    type: Double
  },
  dateReservationStart: Date,
  dateReservationEnd: Date,
  idUser: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  idFolioServices: [{
    type: Schema.Types.ObjectId,
    ref: 'FolioService'
  }],
  idRoom: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }]
});

reservationsSchedule.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Reservation = model('Reservation', reservationsSchedule);

module.exports = Reservation;