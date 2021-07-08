const jwt = require('jsonwebtoken');
const {
  ERR_CODE_UN_AUTH,
  ERR_CODE_INT_SER,
  SECRET_CODE
} = require('../utils/constants');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(ERR_CODE_UN_AUTH).json({ message: 'Ошибка при авторизации' });
    }
    const payload = jwt.verify(token, SECRET_CODE);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(ERR_CODE_INT_SER).json({ message: 'Ошибка при авторизации' });
  }
};
