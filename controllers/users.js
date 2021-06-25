const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
