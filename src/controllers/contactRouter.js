const contactRouter = require('express').Router();

const adminStractor = require('../middlewares/adminStractor');
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
contactRouter.get('/get-all-messages', adminStractor, async(req, res) => {
  const getMessagesContact = (await Contact.find({})).reverse();
  res.send(getMessagesContact);
});
contactRouter.delete('/delete-message-contact/:idMessage', adminStractor, (req, res, next) => {
  const {idMessage} = req.params;
  Contact.findByIdAndRemove(idMessage).then(() => {
    res.status(204).end();
  }).catch(err => {
    next(err);
  });
});

module.exports = contactRouter;