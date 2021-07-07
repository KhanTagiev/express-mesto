const bcrypt = require('bcrypt');
const User = require('../models/user');

const {
  OK_CODE,
  ERR_CODE_BAD_REQ,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_INT_SER,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    return res.status(OK_CODE).send(await User.find({}));
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);
    const isUserRegistered = await User.findOne({ email });
    if (isUserRegistered) {
      return res.status(409).json({ message: 'Пользователь с таким email уже зарегистрирован в системе' });
    }

    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERR_CODE_INT_SER).send({
      message: 'Произошла ошибка',
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
    }
    return res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(ERR_CODE_INT_SER).send(err);
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
    }
    return res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении  аватара' });
    }
    return res.status(ERR_CODE_INT_SER).send(err);
  }
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
