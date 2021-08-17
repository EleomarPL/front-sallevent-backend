const reservationRouter = require('express').Router();

const userStractor = require('../middlewares/userStractor');
const adminStractor = require('../middlewares/adminStractor');

const FolioServices = require('../models/FolioServices');
const SelectedServices = require('../models/SelectedServices');
const Reservations = require('../models/Reservations');
const Room = require('../models/Room');

reservationRouter.get('/get-only-date-reservations', async(req, res) => {
  const getDateReservation = await Reservations.find({});
  const filterOnlyDate = getDateReservation.map(reservation => reservation.dateReservationStart);
  res.send(filterOnlyDate);
});

reservationRouter.get('/get-reservations', userStractor, async(req, res) => {
  const {userId: id} = req;

  const getReservationFromThisUser = await Reservations.find({idUser: id});
  res.send(getReservationFromThisUser);
});

reservationRouter.get('/get-reservations-admin', adminStractor, async(req, res) => {
  const getReservationFromThisUser = await Reservations.find({});
  res.send(getReservationFromThisUser);
});

reservationRouter.post('/create-reservation', userStractor, async(req, res, next) => {
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

reservationRouter.put('/edit-reservation', userStractor, async(req, res, next) => {
  const {totalServices, listSelectedServices = [], typeEvent, timeStart, timeEnd, idReservation} = req.body;
  const {userId: id} = req;
  let idRoom = process.env.ID_ROOM;

  try {
    if (!(totalServices && listSelectedServices && typeEvent && timeStart && timeEnd && idReservation)) {
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

    const reservationData = await Reservations.findById(idReservation);
    if (!reservationData) {
      return res.status(500).json({
        error: 'Fail to find the room'
      });
    } else if (reservationData.idUser.toString() !== id.toString()) {
      return res.status(400).json({
        error: 'This user is not valid'
      });
    } else if (reservationData.statusReservation === 1) {
      return res.status(400).json({
        error: 'This reservation cannot be modified'
      });
    }

    await SelectedServices.deleteMany({idFolioService: reservationData.idFolioServices});

    let createSelectedServices;
    listSelectedServices.forEach(async(service) => {
      createSelectedServices = new SelectedServices({
        amountService: service.amountService,
        totalService: service.totalService,
        idService: service.id,
        idFolioService: reservationData.idFolioServices
      });
      await createSelectedServices.save();
    });

    const editFolioService = {
      totalServices
    };
    await FolioServices.findByIdAndUpdate(reservationData.idFolioServices, editFolioService, {new: true});
    let _dateReservationStart = reservationData.dateReservationStart.toISOString().split('T');
    let _dateReservationEnd = reservationData.dateReservationEnd.toISOString().split('T');
    const editReservation = {
      typeEvent,
      priceTotal: totalServices + roomData.priceHour,
      dateReservationStart: _dateReservationStart[0] + ' ' + timeStart + ':00:00.000Z',
      dateReservationEnd: _dateReservationEnd[0] + ' ' + timeEnd + ':00:00.000Z'
    };
    const savedChangeReservation = await Reservations.findByIdAndUpdate(idReservation, editReservation, {new: true});
    res.send(savedChangeReservation);
  } catch (err) {
    next(err);
  }

});
reservationRouter.put('/confirm-reservation', adminStractor, async(req, res, next) => {
  const {idReservation} = req.body;

  try {
    const reservationData = await Reservations.findById(idReservation);
    if (!reservationData) {
      return res.status(500).json({
        error: 'Fail to find the room'
      });
    } else if (reservationData.statusReservation === 1) {
      return res.status(400).json({
        error: 'This reservation cannot be modified'
      });
    }
    
    const editReservation = {
      statusReservation: 1
    };
    const savedChangeReservation = await Reservations.findByIdAndUpdate(idReservation, editReservation, {new: true});
    res.send(savedChangeReservation);
  } catch (err) {
    next(err);
  }
});

reservationRouter.delete('/delete-reservation', userStractor, async(req, res, next) => {
  const {idReservation} = req.body;
  const {userId: id} = req;

  try {
    const reservationData = await Reservations.findById(idReservation);

    if (!reservationData) {
      return res.status(404).json({
        error: 'No reservation found'
      });
    } else if (reservationData.idUser.toString() !== id.toString()) {
      return res.status(400).json({
        error: 'This user is not valid'
      });
    } else if (reservationData.statusReservation === 1) {
      return res.status(400).json({
        error: 'This reservation cannot be deleted'
      });
    }

    await SelectedServices.deleteMany({idFolioService: reservationData.idFolioServices});
    await FolioServices.findById(reservationData.idFolioServices);

    Reservations.findByIdAndRemove(idReservation).then(() => {
      res.status(204).end();
    }).catch(err => {
      next(err);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = reservationRouter;