const userRouter = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  getUsers, getUserId, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', authMiddleware, getUsers);
userRouter.get('/users/:userId', getUserId);
userRouter.patch('/users/me', updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
