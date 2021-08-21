const roomRouter = require('express').Router();

const Room = require('../models/Room');
const InfoRoom = require('../models/InfoRoom');
const Direction = require('../models/Direction');
const User = require('../models/User');

roomRouter.get('/get-info-footer', async(req, res, next) => {
  const idRoom = process.env.ID_ROOM;
  try {

    const getData = await Room.findById(idRoom).populate('idInfo');
    const directionRoom = await Direction.findById(getData.idInfo[0].idDirection[0]);
    const getAdmin = await User.findOne({type: 1});
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

module.exports = roomRouter;