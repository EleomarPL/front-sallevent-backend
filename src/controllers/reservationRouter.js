const reservationRouter = require('express').Router();

const adminStractor = require('../middlewares/adminStractor');

const FolioServices = require('../models/FolioServices');
const SelectedServices = require('../models/SelectedServices');
const Reservations = require('../models/Reservations');
const Room = require('../models/Room');

reservationRouter.post('/create-reservation', adminStractor, async(req, res, next) => {
  const {totalServices, listSelectedServices = [], typeEvent, dateReservationStart, dateReservationEnd} = req.body;
  let idRoom = process.env.ID_ROOM;
  const {userId: id} = req;
  try {
    if (!(totalServices && listSelectedServices && typeEvent && dateReservationStart && dateReservationEnd )) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }

    const roomData = await Room.findById(idRoom);
    if (!roomData) {
      return res.status(500).json({
        error: 'Fail to find the room'
      });
    }

    const createFolioServices = new FolioServices({
      totalServices
    });
    let createSelectedServices;
    const savedFolioServices = await createFolioServices.save();
    listSelectedServices.forEach(async(service) => {
      createSelectedServices = new SelectedServices({
        amountService: service.amountService,
        totalService: service.totalService,
        idService: service.id,
        idFolioService: savedFolioServices.id
      });
      await createSelectedServices.save();
    });

    const newReservation = new Reservations({
      typeEvent,
      statusReservation: 0,
      priceTotal: totalServices + roomData.priceHour,
      dateReservationStart: dateReservationStart + ':00:00.000Z',
      dateReservationEnd: dateReservationEnd + ':00:00.000Z',
      idUser: id,
      idFolioServices: savedFolioServices.id,
      idRoom
    });
    
    let savedReservation = await newReservation.save();

    res.send(savedReservation);

  } catch (err) {
    next(err);
  }

});

module.exports = reservationRouter;