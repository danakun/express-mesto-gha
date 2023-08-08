const Card = require('../models/card');

const { SUCCESS } = require('../utils/constants');
const { CREATED } = require('../utils/constants');

const BadRequest = require('../errors/BadRequest');
const AccessForbidden = require('../errors/AccessForbidden');
const NotFound = require('../errors/NotFound');

const getCards = (req, res, next) => Card
  .find({})
  .then((cards) => res.status(SUCCESS).send({ data: cards }))
  .catch(next);

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card
    .create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFound('Карточки по заданному id не найдено'))
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new AccessForbidden('Чужую карточку нельзя удалить');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    }) // return card.remove()
    .then((card) => {
      res.send(card); // { data: card }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Невалидный id карточки'));
      }
      next(error);
      return null;
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFound('Карточки по заданному id не найдено'))
  .then((card) => res.status(SUCCESS).send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
      return;
    }
    next(error);
  });

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFound('Карточки по заданному id не найдено'))
    .then((card) => res.status(SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
