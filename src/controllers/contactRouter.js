const contactRouter = require('express').Router();

const Contact = require('../models/Contac');

contactRouter.post('/send-contact', async(req, res, next) => {
  const { fullName, email, phone, text} = req.body;
  if (!(fullName && email && phone && text)) {
    return res.status(400).json({
      error: 'All parameters are required'
    });
  }
  if ( isNaN(phone) )
    return res.send({message: 'is not number'});
  else {
    if (phone.length < 10 )
      return res.send({message: 'invalid number'});
  }
  try {
    const newMessageContact = new Contact({ fullName, email, phone, text });
    const savedMessageContact = await newMessageContact.save();
    
    res.send(savedMessageContact);
  } catch (err) {
    next(err);
  }
});

module.exports = contactRouter;