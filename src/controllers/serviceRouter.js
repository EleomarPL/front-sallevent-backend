const serviceRouter = require('express').Router();

const Service = require('../models/Services');
const Room = require('../models/Room');
const adminStractor = require('../middlewares/adminStractor');

serviceRouter.get('/get-all-services', async(req, res) => {
  const getAllServices = await Service.find({});
  res.send(getAllServices);
});
serviceRouter.get('/get-all-services/:nameService', async(req, res, next) => {
  try {
    const { nameService } = req.params;
    const regexQuery = new RegExp(`.*${nameService}.*`, 'i');
    const getServices = await Service.find({name: regexQuery});
    res.send(getServices);
  } catch (err) {
    next(err);
  }
});
serviceRouter.post('/create-service', adminStractor, async(req, res, next) => {
  const {name, detail, price} = req.body;
  try {
    if (!(name && detail && price)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const newService = new Service({ name, detail, price });
    const savedService = await newService.save();
    res.send(savedService);
  } catch (err) {
    next(err);
  }
});
serviceRouter.put('/edit-service/:idService', adminStractor, async(req, res, next) => {
  const {name, detail, price} = req.body;
  const { idService } = req.params;
  try {
    if (!(idService && name && detail && price)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const editService = {
      name, detail, price
    };
    const savedChangeUser = await Service.findByIdAndUpdate(idService, editService, {new: true});
    res.send(savedChangeUser);
  } catch (err) {
    next(err);
  }
});
serviceRouter.post('/quotation', async(req, res, next) => {
  const { listServices = [], timeStart, timeEnd} = req.body;
  let idRoom = process.env.ID_ROOM;
  try {
    if (!(listServices && timeStart !== undefined && timeEnd !== undefined)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    } else if (isNaN(timeStart) || isNaN(timeEnd)) {
      return res.status(400).json({
        error: 'The hours are not valid'
      });
    } else if ((timeStart < 0 || timeStart > 23) && (timeEnd < 0 || timeEnd > 23)) {
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
    let totalServices = 0;
    let totalTimeReservation = 0;
    let total = 0;

    const allServices = await Service.find({});
    listServices.forEach(element => {
      let getServiceWithId = allServices.find(el => el.id === element.id);
      if (Number(element.amountService) && getServiceWithId)
        totalServices += Number(getServiceWithId.price) * Number(element.amountService);
    });
    
    totalTimeReservation += (timeEnd - timeStart) * roomData.priceHour;

    total = totalServices + totalTimeReservation;
    res.send({total});

  } catch (err) {
    next(err);
  }
});

module.exports = serviceRouter;