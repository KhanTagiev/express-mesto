const jwt = require('jsonwebtoken');
const { SECRET_CODE } = require('../utils/constants');

const UnAuthErr = require('../errors/un_auth_err');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const payload = jwt.verify(token, SECRET_CODE);

    req.user = payload;

    return next();
  } catch (err) { return next(new UnAuthErr('Ошибка при авторизации')); }
};
