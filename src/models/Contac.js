const {Schema, model} = require('mongoose');

const contactSchedule = new Schema({
  fullName: {
    type: String,
    minlength: 2,
    maxlength: 200
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 80
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 14
  },
  text: {
    type: String,
    minlength: 2,
    maxlength: 300
  }
});

contactSchedule.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Contact = model('Contact', contactSchedule);

module.exports = Contact;