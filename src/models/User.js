const {Schema, model} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  type: {
    type: Number,
    min: 0,
    max: 2
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  motherLastName: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 14
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 80
  },
  userName: {
    type: String,
    minlength: 6,
    maxlength: 45,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 45
  },
  date: Date
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;