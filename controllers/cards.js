const Card = require('../models/card');

const { OK_CODE } = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const UnAuthErr = require('../errors/un_auth_err');
const BadReqErr = require('../errors/bad-req-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getCards = async (req, res, next) => {
  try {
    return res.status(OK_CODE).send(await Card.find({}));
  } catch (err) { return next(err); }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = new Card({ name, link, owner });

    await card.save();

    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') { return next(new BadReqErr('Переданы некорректные данные при создании карточки')); }

    return next(err);
  }
};

const deleteCardId = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) { return next(new NotFoundError('Карточка с указанным _id не найдена')); }

    if (String(card.owner) !== req.user._id) { return next(new ForbiddenErr('Карточка не создана вами')); }

    const cardDelete = await Card.findByIdAndRemove(req.params.cardId);

    return res.status(OK_CODE).send(cardDelete);
  } catch (err) {
    if (err.name === 'CastError') { return next(new BadReqErr('Передан некорректный _id карточки')); }

    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) { return next(new NotFoundError('Карточка с указанным _id не найдена')); }

    return res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.name === 'CastError') { return next(new BadReqErr('Переданы некорректные данные для постановки лайка')); }

    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) { return next(new NotFoundError('Карточка с указанным _id не найдена')); }

    return res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.name === 'CastError') { return next(new BadReqErr('Переданы некорректные данные для постановки лайка')); }

    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
