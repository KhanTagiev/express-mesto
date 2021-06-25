const userRouter = require('express').Router();

const { getUsers, getUserId, createUser } = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserId);
userRouter.post('/users', createUser);

module.exports = userRouter;
