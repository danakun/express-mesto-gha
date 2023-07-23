const Card = require('../models/card');
const {
  NotFound,
  BadRequest,
  InternalServerError,
} = require('./users');

const getCards = (req, res) => Card
  .find({})
  .then((cards) => res.status(200).send(cards))
  .catch((error) => {
    res.status(BadRequest).send({ message: `Некорректные данные: ${error}` });
  });

const createCard = (req, res) => {
  // console.log(req.params.userId);
  const { _id } = req.user;
  const { name, link } = req.body;
  console.log(req.user._id);
  return Card
    .create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(InternalServerError).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res
        .status(BadRequest)
        .send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(InternalServerError).send({ message: 'Ошибка сервера' });
    }
  });

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(InternalServerError).send({ message: 'Ошибка сервера' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BadRequest).send({ message: `Пользователь не найден: ${error}` });
    } else {
      res.status(InternalServerError).send({ message: 'Ошибка сервера' });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };
