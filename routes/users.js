const userRouter = require('express').Router();

const { createUser } = require('../controllers/users');

userRouter.post('/users', createUser);

module.exports = userRouter;
