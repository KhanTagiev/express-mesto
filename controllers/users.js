const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { OK_CODE, SECRET_CODE } = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const UnAuthErr = require('../errors/un_auth_err');
const BadReqErr = require('../errors/bad-req-err');
const ConflictErr = require('../errors/conflict-err');

const getUsers = async (req, res, next) => {
  try {
    return res.status(OK_CODE).send(await User.find({}));
  } catch (err) { return next(err); }
};

const getUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) { return next(new NotFoundError('Пользователь по указанному _id не найден')); }

    return res.status(OK_CODE).send(user);
  } catch (err) { return next(err); }
};

const getMeProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) { return next(new NotFoundError('Пользователь по указанному _id не найден')); }

    return res.status(OK_CODE).send(user);
  } catch (err) { return next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) { return next(new UnAuthErr('Переданы некорректные данные для авторизации')); }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) { return next(new UnAuthErr('Переданы некорректные для авторизации')); }

    const token = jwt.sign({ _id: user._id }, SECRET_CODE, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 10080000,
      httpOnly: true,
    });

    return res.status(OK_CODE).send({ token });
  } catch (err) { return next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);

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
    if (err.name === 'ValidationError') { return next(new BadReqErr('Переданы некорректные данные для создания пользователя')); }

    if (err.name === 'MongoError' && err.code === 11000) { return next(new ConflictErr('Пользователь с таким email уже зарегистрирован в системе')); }

    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (!user) { return next(new NotFoundError('Пользователь по указанному _id не найден')); }

    return res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') { return next(new BadReqErr('Переданы некорректные данные при обновлении профиля')); }

    return next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;

    const user = await User.findByIdAndUpdate(owner, { avatar }, {
      new: true,
      runValidators: true,
    });

    if (!user) { return next(new NotFoundError('Пользователь по указанному _id не найден')); }

    return res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') { return next(new BadReqErr('Переданы некорректные данные при обновлении  аватара')); }

    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserId,
  getMeProfile,
  login,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
