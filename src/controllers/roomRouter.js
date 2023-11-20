const roomRouter = require('express').Router();

const Room = require('../models/Room');
const InfoRoom = require('../models/InfoRoom');
const Schedule = require('../models/Schedule');
const Direction = require('../models/Direction');
const User = require('../models/User');

const adminStractor = require('../middlewares/adminStractor');

roomRouter.get('/get-info-footer', async(req, res, next) => {
  const idRoom = process.env.ID_ROOM;
  try {

    const getData = await Room.findById(idRoom).populate('idInfo');
    const directionRoom = await Direction.findById(getData.idInfo[0].idDirection[0]);
    const getAdmin = await User.findOne({type: 0});
    if (directionRoom && getAdmin) {
      const dataToSend = {
        email: getAdmin.email,
        phone: getAdmin.phone,
        street: directionRoom.street,
        municipality: directionRoom.municipality,
        state: directionRoom.state
      };
      return res.send(dataToSend);
    }
    return res.status(500).json({
      error: 'Internal Error'
    });
  } catch (err) {
    next(err);
  }
});
roomRouter.get('/get-info-room', async(req, res, next) => {
  const idRoom = process.env.ID_ROOM;
  try {
    const getRoom = await Room.findById(idRoom).
      populate({
        path: 'idInfo',
        populate: 'idDirection idSchedule'
      });
    res.send({
      room: {
        id: getRoom.id,
        name: getRoom.name,
        capacity: getRoom.capacity,
        description: getRoom.description,
        priceHour: getRoom.priceHour
      },
      schedule: getRoom.idInfo[0].idSchedule[0],
      direction: getRoom.idInfo[0].idDirection[0]
    });
  } catch (err) {
    next(err);
  }
});
roomRouter.put('/update-info-room', adminStractor, async(req, res, next) => {
  const idRoom = process.env.ID_ROOM;
  const {
    name, capacity, description, priceHour, street, state, municipality, suburb,
    sunday, monday, tuesday, wednesday, thursday, friday, saturday
  } = req.body;

  try {
    if (!(name && capacity && description && priceHour && street && state && municipality && suburb,
    sunday && monday && tuesday && wednesday && thursday && friday && saturday)
    ) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    let dataUpdateRoom = {
      name, capacity, description, priceHour
    };
    let dataUpdateDirection = {
      street, state, municipality, suburb
    };
    let dataUpdateSchedule = {
      sunday, monday, tuesday, wednesday, thursday, friday, saturday
    };
    const getRoom = await Room.findById(idRoom).populate('idInfo');
    let idRoomToUpdate = getRoom.id;
    let idDirectionToUpdate = getRoom.idInfo[0].idDirection;
    let idScheduleToUpdate = getRoom.idInfo[0].idSchedule;

    const savedUpdateDirecion = await Direction.findByIdAndUpdate(idDirectionToUpdate, dataUpdateDirection, {new: true});
    const savedUpdateShedule = await Schedule.findByIdAndUpdate(idScheduleToUpdate, dataUpdateSchedule, {new: true});
    const savedUpdateRoom = await Room.findByIdAndUpdate(idRoomToUpdate, dataUpdateRoom, {new: true});

    res.send({
      room: {
        id: savedUpdateRoom.id,
        name: savedUpdateRoom.name,
        capacity: savedUpdateRoom.capacity,
        description: savedUpdateRoom.description,
        priceHour: savedUpdateRoom.priceHour
      },
      schedule: savedUpdateShedule,
      direction: savedUpdateDirecion
    });
    res.send({getRoom, idRoomToUpdate, idDirectionToUpdate, idScheduleToUpdate});
  } catch (err) {
    next(err);
  }
});

module.exports = roomRouter;