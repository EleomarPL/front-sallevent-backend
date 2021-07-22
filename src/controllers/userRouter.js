const userRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

userRouter.post('/create-user', async(req, res, next) => {
  const {
    name, lastName, motherLastName, phone, email, userName, password
  } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    if (!(name && lastName && motherLastName && phone && email &&
      userName && password)
    ) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const newUser = new User({
      name, lastName, motherLastName, phone,
      email, userName, password: passwordHash,
      type: 1, date: new Date()
    });
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;