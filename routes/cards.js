const cardRouter = require('express').Router();

const { getCards, createCard, deleteCardId } = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCardId);

module.exports = cardRouter;
