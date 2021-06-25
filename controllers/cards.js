const Card = require('../models/card');

getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
}

createCard = (req, res) => {
 const { name,link } = req.body;
  const owner = req.user._id
  Card.create({ name, link , owner})
    .then( card => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
    }));
}
module.exports = {
  getCards,
  createCard,
  deleteCardId
}