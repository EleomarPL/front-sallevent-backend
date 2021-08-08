const serviceRouter = require('express').Router();

const Service = require('../models/Services');

serviceRouter.get('/get-all-services', async(req, res) => {
  const getAllServices = await Service.find({});
  res.send(getAllServices);
});

module.exports = serviceRouter;