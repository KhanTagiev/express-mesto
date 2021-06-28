const User = require('../models/user');

const {
  OK_CODE,
  ERR_CODE_BAD_REQ,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_INT_SER,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }

      res.status(ERR_CODE_INT_SER).send(err);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении  аватара' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
