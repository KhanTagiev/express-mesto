const Card = require('../models/card');
const {
  OK_CODE,
  ERR_CODE_BAD_REQ,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_INT_SER,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные для удаления карточки' });
        return;
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      res.status(ERR_CODE_INT_SER).send({
        message: 'Произошла ошибка',
      });
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
