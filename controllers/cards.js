const Card = require('../models/card');
const {
  OK_CODE,
  ERR_CODE_BAD_REQ,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_INT_SER,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    return res.status(OK_CODE).send(await Card.find({}));
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = new Card({ name, link, owner });

    await card.save();
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const deleteCardId = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(ERR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERR_CODE_BAD_REQ).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return res.status(ERR_CODE_INT_SER).send({ message: 'Произошла ошибка' });
  }
};
module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
