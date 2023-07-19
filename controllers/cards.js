const card = require('../models/card');
const {
  NotFound,
  BadRequest,
  InternalServerError,
} = require('./users');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user._id })
    .then((crd) => res.status(201).send(crd))
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

const deleteCard = (req, res) => card
  .findByIdAndRemove(req.params.cardId)
  .then((crd) => {
    if (!crd) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
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

const getCards = (req, res) => card
  .find({})
  .then((cards) => res.status(200).send(cards))
  .catch((error) => {
    res.status(BadRequest).send({ message: `Некорректные данные: ${error}` });
  });

const likeCard = (req, res) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(InternalServerError).send({ message: 'Ошибка сервера' });
    }
  });

const dislikeCard = (req, res) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BadRequest).send({ message: `Пользователь не найден: ${error}` });
    } else {
      res.status(InternalServerError).send({ message: 'Ошибка сервера' });
    }
  });

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };
