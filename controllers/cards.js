const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
