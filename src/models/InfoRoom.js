const {Schema, model} = require('mongoose');

const infoRoomSchedule = new Schema({
  idDirection: [{
    type: Schema.Types.ObjectId,
    ref: 'Direction'
  }],
  idSchedule: [{
    type: Schema.Types.ObjectId,
    ref: 'Schedule'
  }]
});

infoRoomSchedule.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const InfoRoom = model('InfoRoom', infoRoomSchedule);

module.exports = InfoRoom;