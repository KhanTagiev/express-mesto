const cardRouter = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  getCards, createCard, deleteCardId, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', authMiddleware, getCards);
cardRouter.post('/cards', authMiddleware, createCard);
cardRouter.delete('/cards/:cardId', authMiddleware, deleteCardId);
cardRouter.put('/cards/:cardId/likes', authMiddleware, likeCard);
cardRouter.delete('/cards/:cardId/likes', authMiddleware, dislikeCard);

module.exports = cardRouter;
