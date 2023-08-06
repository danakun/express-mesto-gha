const Card = require('../models/card');

const { SUCCESS } = require('../utils/constants');
const { CREATED } = require('../utils/constants');
const { BAD_REQUEST } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

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
      //   res.status(BAD_REQUEST).send({
      //     message: 'Переданы некорректные данные при создании карточки',
      //   });
      // } else {
      //   res.status(INTERNAL_SERVER_ERROR).send({ message: error.message });
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => new NotFound('Карточки по заданному id не найдено'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new AccessForbidden('Чужую карточку нельзя удалить'));
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидный id карточки'));
      } else {
        next(error);
      }
    });
};

// const deleteCard = (req, res, next) =>
//   Card.findByIdAndRemove(req.params.cardId)
//   .then((card) => {
//     if (!card) {
//       res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
//       return;
//     }
//     res.send({ data: card });
//   })
//   .catch((error) => {
//     if (error.name === 'CastError') {
//       res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
//     } else {
//       res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
//     }
//   });}

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(SUCCESS).send(card);
  })
  .catch((error) => {
    if (error) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(SUCCESS).send(card);
  })
  .catch((error) => {
    if (error) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: error.message });
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
