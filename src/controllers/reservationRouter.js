const reservationRouter = require('express').Router();

const userStractor = require('../middlewares/userStractor');
const adminStractor = require('../middlewares/adminStractor');

const FolioServices = require('../models/FolioServices');
const SelectedServices = require('../models/SelectedServices');
const Reservations = require('../models/Reservations');
const Room = require('../models/Room');
const Service = require('../models/Services');

reservationRouter.get('/get-only-date-reservations', async(req, res) => {
  const getDateReservation = await Reservations.find({});
  const filterOnlyDate = getDateReservation.map(reservation => {
    return {
      dateReservation: reservation.dateReservationStart,
      statusReservation: reservation.statusReservation
    };
  });
  res.send(filterOnlyDate);
});

reservationRouter.get('/get-only-reservation/:idReservation', userStractor, async(req, res) => {
  const { idReservation } = req.params;

  const getReservation = await Reservations.findById(idReservation);
  res.send(getReservation);
});

reservationRouter.get('/get-reservation/:idReservation', userStractor, async(req, res) => {
  const { idReservation } = req.params;

  const getReservation = await Reservations.findById(idReservation);
  if (!getReservation) {
    return res.status(404).json({
      error: 'Reservation Not Found'
    });
  }
  const getServices = await SelectedServices.find({idFolioService: getReservation.idFolioServices});
  let listServices = getServices.map(data => {
    return {
      id: data.idService[0],
      amountService: data.amountService,
      totalService: data.totalService
    };
  });
  let dataToSend = {
    id: getReservation.id,
    typeEvent: getReservation.typeEvent,
    timeStart: getReservation.dateReservationStart.toISOString().split('T')[1].split(':')[0],
    timeEnd: getReservation.dateReservationEnd.toISOString().split('T')[1].split(':')[0],
    dateYYMMDD: getReservation.dateReservationStart.toISOString().split('T')[0],
    priceTotal: getReservation.priceTotal,
    statusReservation: getReservation.statusReservation,
    listServices
  };
  res.send(dataToSend);
});
 
reservationRouter.get('/get-reservations', userStractor, async(req, res) => {
  const {userId: id} = req;

  const getReservationFromThisUser = await Reservations.find({idUser: id});
  res.send(getReservationFromThisUser);
});

reservationRouter.get('/get-reservations-admin', adminStractor, async(req, res) => {
  const getReservationFromThisUser = await Reservations.find({}).populate('idUser');
  res.send(getReservationFromThisUser);
});

reservationRouter.get('/verify-date-to-reservation', async(req, res, next) => {
  const {dateYYMMDD} = req.body;
  try {
    if (!dateYYMMDD ) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const getReservations = await Reservations.find({});
    const getOnlyDates =
      getReservations.map(reservation => reservation.dateReservationStart.toISOString().split('T')[0]);
    let isBooked = getOnlyDates.includes(dateYYMMDD);
    res.send(isBooked);

  } catch (err) {
    next(err);
  }
});

reservationRouter.post('/create-reservation', userStractor, async(req, res, next) => {
  const {listSelectedServices = [], typeEvent, timeStart, timeEnd, dateYYMMDD} = req.body;
  let idRoom = process.env.ID_ROOM;
  const {userId: id} = req;
  try {
    if (!(listSelectedServices && typeEvent && !isNaN(timeStart) && timeEnd && dateYYMMDD )) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    } else if (isNaN(timeStart) || isNaN(timeEnd)) {
      return res.status(400).json({
        error: 'The hours are not valid'
      });
    } else if (Number(timeStart) < 0 || Number(timeStart) > 23 || (Number(timeEnd) < 0 || Number(timeEnd) > 23)) {
      return res.status(400).json({
        error: 'Invalid hours'
      });
    } else if (timeStart >= timeEnd) {
      return res.status(400).json({
        error: 'The reservation time range is not valid'
      });
    } else if (dateYYMMDD.length !== 10) {
      return res.status(400).json({
        error: 'Date YYMMDD is not valid'
      });
    }

    const getReservations = await Reservations.find({});
    const getOnlyDates =
      getReservations.map(reservation => reservation.dateReservationStart.toISOString().split('T')[0]);
    let isBooked = getOnlyDates.includes(dateYYMMDD);
    if (isBooked) {
      return res.status(406).json({
        message: 'Already booked'
      });
    }

    let totalServices = 0;

    const allServices = await Service.find({});
    listSelectedServices.forEach(element => {
      if (!(element.amountService && element.id)) {
        return res.status(400).json({
          error: 'Poorly formed service list'
        });
      }
      let getServiceWithId = allServices.find(el => el.id === element.id);
      if (Number(element.amountService) && getServiceWithId)
        totalServices += Number(getServiceWithId.price) * Number(element.amountService);
    });

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
      let totalThisService = 0;
      let getServiceWithId = allServices.find(el => el.id === service.id);

      if (Number(service.amountService) && getServiceWithId)
        totalThisService = Number(getServiceWithId.price) * Number(service.amountService);
      if (totalThisService !== 0) {
        createSelectedServices = new SelectedServices({
          amountService: service.amountService,
          totalService: totalThisService,
          idService: service.id,
          idFolioService: savedFolioServices.id
        });
        await createSelectedServices.save();
      }
    });
    let totalTimeReservation = (timeEnd - timeStart) * roomData.priceHour;
    const newReservation = new Reservations({
      typeEvent,
      statusReservation: 0,
      priceTotal: totalServices + totalTimeReservation,
      dateReservationStart: `${dateYYMMDD} ${timeStart}:00:00.000Z`,
      dateReservationEnd: `${dateYYMMDD} ${timeEnd}:00:00.000Z`,
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

reservationRouter.put('/edit-reservation/:idReservation', userStractor, async(req, res, next) => {
  const { idReservation } = req.params;
  const {listSelectedServices = [], typeEvent, timeStart, timeEnd} = req.body;
  const {userId: id} = req;
  let idRoom = process.env.ID_ROOM;

  try {
    if (!(listSelectedServices && typeEvent && !isNaN(timeStart) && timeEnd)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    } else if (isNaN(timeStart) || isNaN(timeEnd)) {
      return res.status(400).json({
        error: 'The hours are not valid'
      });
    } else if (Number(timeStart) < 0 || Number(timeStart) > 23 || (Number(timeEnd) < 0 || Number(timeEnd) > 23)) {
      return res.status(400).json({
        error: 'Invalid hours'
      });
    } else if (timeStart >= timeEnd) {
      return res.status(400).json({
        error: 'The reservation time range is not valid'
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
    let totalServices = 0;
    const allServices = await Service.find({});

    listSelectedServices.forEach(element => {
      if (!(element.amountService && element.id)) {
        return res.status(400).json({
          error: 'Poorly formed service list'
        });
      }
      let getServiceWithId = allServices.find(el => el.id === element.id);
      if (Number(element.amountService) && getServiceWithId)
        totalServices += Number(getServiceWithId.price) * Number(element.amountService);
    });

    await SelectedServices.deleteMany({idFolioService: reservationData.idFolioServices});

    let createSelectedServices;
    listSelectedServices.forEach(async(service) => {
      let totalThisService = 0;
      let getServiceWithId = allServices.find(el => el.id === service.id);

      if (Number(service.amountService) && getServiceWithId)
        totalThisService = Number(getServiceWithId.price) * Number(service.amountService);
      if (totalThisService !== 0) {
        createSelectedServices = new SelectedServices({
          amountService: service.amountService,
          totalService: service.totalService,
          idService: service.id,
          idFolioService: reservationData.idFolioServices
        });
        await createSelectedServices.save();
      }
    });

    const editFolioService = {
      totalServices
    };
    await FolioServices.findByIdAndUpdate(reservationData.idFolioServices, editFolioService, {new: true});

    let totalTimeReservation = (timeEnd - timeStart) * roomData.priceHour;

    let _dateReservationStart = reservationData.dateReservationStart.toISOString().split('T');
    let _dateReservationEnd = reservationData.dateReservationEnd.toISOString().split('T');
    const editReservation = {
      typeEvent,
      priceTotal: totalServices + totalTimeReservation,
      dateReservationStart: `${_dateReservationStart[0]} ${timeStart}:00:00.000Z`,
      dateReservationEnd: `${_dateReservationEnd[0]} ${timeEnd}:00:00.000Z`
    };
    const savedChangeReservation = await Reservations.findByIdAndUpdate(idReservation, editReservation, {new: true});
    res.send(savedChangeReservation);
  } catch (err) {
    next(err);
  }

});
reservationRouter.put('/confirm-reservation/:idReservation', adminStractor, async(req, res, next) => {
  const { idReservation } = req.params;

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

reservationRouter.delete('/delete-reservation/:idReservation', userStractor, async(req, res, next) => {
  const { idReservation } = req.params;
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