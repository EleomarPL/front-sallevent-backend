const serviceRouter = require('express').Router();

const Service = require('../models/Services');
const adminStractor = require('../middlewares/adminStractor');

serviceRouter.get('/get-all-services', async(req, res) => {
  const getAllServices = await Service.find({});
  res.send(getAllServices);
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
serviceRouter.put('/edit-service', adminStractor, async(req, res, next) => {
  const {id, name, detail, price} = req.body;
  try {
    if (!(id && name && detail && price)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const editService = {
      name, detail, price
    };
    const savedChangeUser = await Service.findByIdAndUpdate(id, editService, {new: true});
    res.send(savedChangeUser);
  } catch (err) {
    next(err);
  }
});

module.exports = serviceRouter;