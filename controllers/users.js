const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { handleError } = require('../helpers/handle-error.js');

module.exports.createUser = (req, res) => {
  const {
    name,
    email,
    password,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
        about,
        avatar,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          const { status, message } = handleError(err);
          res.status(status).send({ message });
        });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotFoundUserId'))
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.updateUser = (req, res) => {
  const { _id: userId } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundUserId'))
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { _id: userId } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundUserId'))
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};
