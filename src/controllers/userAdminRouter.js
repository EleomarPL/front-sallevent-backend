const userAdminRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const adminStractor = require('../middlewares/adminStractor');

userAdminRouter.get('/get-users/', adminStractor, async(req, res, next) => {
  try {
    const getUsers = await User.find({type: 1});
    res.send(getUsers);
  } catch (err) {
    next(err);
  }
});
userAdminRouter.get('/get-users/:nameUser', adminStractor, async(req, res, next) => {
  try {
    const { nameUser } = req.params;
    const regexQuery = new RegExp(`.*${nameUser}.*`, 'i');
    const getUsers = await User.find({userName: regexQuery, type: 1});
    res.send(getUsers);
  } catch (err) {
    next(err);
  }
});
userAdminRouter.put('/edit-data-admin', adminStractor, async(req, res, next) => {
  const {
    name, lastName, motherLastName, phone, email, userName
  } = req.body;
  const {userId: id} = req;
  try {
    if (!(name && lastName && motherLastName && phone && email &&
      userName)
    ) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const editAdmin = {
      name, lastName, motherLastName, phone,
      email, userName
    };
    const savedChangeAdmin = await User.findByIdAndUpdate(id, editAdmin, {new: true});
    res.send(savedChangeAdmin);
  } catch (err) {
    next(err);
  }
});
userAdminRouter.put('/edit-password-admin/', adminStractor, async(req, res, next) => {
  const {
    oldPassword, newPassword
  } = req.body;
  const {userId: id} = req;
  try {
    if (!(oldPassword && newPassword)) {
      return res.status(400).json({
        error: 'All parameters are required'
      });
    }
    const findUser = await User.findById(id);
    const passwordUser = findUser === null
      ? false
      : await bcrypt.compare(oldPassword, findUser.password);
    if (!(passwordUser && findUser)) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const editAdmin = {
      password: passwordHash
    };
    const savedChangeAdmin = await User.findByIdAndUpdate(id, editAdmin, {new: true});
    res.send(savedChangeAdmin);
  } catch (err) {
    next(err);
  }
});

module.exports = userAdminRouter;