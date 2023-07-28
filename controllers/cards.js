const Card = require('../models/card');
// const NotFound = require('../errors/NotFound');
// const InternalServerError = require('../errors/InternalServerError');
// const BadRequest = require('../errors/BadRequest');

const { SUCCESS } = require('../utils/constants');
const { CREATED } = require('../utils/constants');
const { BAD_REQUEST } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

const getCards = (req, res) => Card
  .find({})
  .then((cards) => res.status(SUCCESS).send(cards))
  .catch((error) => {
    res.status(BAD_REQUEST).send({ message: `Некорректные данные: ${error}` });
  });

const createCard = (req, res) => {
  // console.log(req.params.userId);
  // const { _id } = req.user;
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card
    .create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: error.message });
      }
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  });

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

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };
