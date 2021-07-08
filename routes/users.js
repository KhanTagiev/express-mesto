const userRouter = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  getUsers, getUserId, getMeProfile, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', authMiddleware, getUsers);
userRouter.get('/users/me', authMiddleware, getMeProfile);
userRouter.get('/users/:userId', authMiddleware, getUserId);
userRouter.patch('/users/me', authMiddleware, updateUserProfile);
userRouter.patch('/users/me/avatar', authMiddleware, updateUserAvatar);

module.exports = userRouter;
