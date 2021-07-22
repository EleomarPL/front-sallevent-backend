const {Schema, model} = require('mongoose');

const scheduleSchema = new Schema({
  sunday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  monday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  tuesday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  wednesday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  thursday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  friday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  },
  saturday: {
    type: String,
    enum: {
      values: ['N', 'Y'],
      message: '{VALUE} is not supported'
    }
  }
});

scheduleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Schedule = model('Schedule', scheduleSchema);

module.exports = Schedule;