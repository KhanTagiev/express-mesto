const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');
const {
  getCards, createCard, deleteCardId, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', authMiddleware, getCards);

cardRouter.post('/cards', [celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), authMiddleware], createCard);

cardRouter.delete('/cards/:cardId', [celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), authMiddleware], deleteCardId);

cardRouter.put('/cards/:cardId/likes', [celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), authMiddleware], likeCard);

cardRouter.delete('/cards/:cardId/likes', [celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), authMiddleware], dislikeCard);

module.exports = cardRouter;
