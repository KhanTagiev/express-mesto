const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const {
  ERR_CODE_NOT_FOUND,
  MONGODB_URL,
  MONGODB_OPTIONS,
} = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);

app.use((req, res, next) => {
  req.user = {
    _id: '60d5c8cc8ac2e78a63ccf068',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((req, res) => {
  res.status(ERR_CODE_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
