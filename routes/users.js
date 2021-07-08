const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');
const {
  getUsers, getUserId, getMeProfile, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

const urlValidationMethod = require('../utils/url_valid_meth');

userRouter.get('/users', authMiddleware, getUsers);

userRouter.get('/users/me', authMiddleware, getMeProfile);

userRouter.get('/users/:userId', [celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
}), authMiddleware], getUserId);

userRouter.patch('/users/me', [celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), authMiddleware], updateUserProfile);

userRouter.patch('/users/me/avatar', [celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidationMethod),
  }),
}), authMiddleware], updateUserAvatar);

module.exports = userRouter;
