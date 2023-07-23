const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof NotFound) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const getUsers = (req, res, next) => User.find({})
  .orFail(() => {
    throw new InternalServerError();
  })
  .then((users) => res.status(200).send(users))
  .catch(() => {
    next(new InternalServerError());
  });

const createUser = (req, res, next) => User.create(req.body)
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequest('При создании пользователя переданы некорректные данные'));
      res.status(400).send(err);
    } else {
      next(new InternalServerError());
    }
  });

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new InternalServerError());
      }
    });
};

// const updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//     User
//     .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequest('При обновлении аватара переданы некорректные данные'));
//         return;
//       }
//       next(new InternalServerError());
//     });
// };

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь по указанному id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('При обновлении аватара переданы некорректные данные'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports = {
  getUser, getUsers, createUser, updateUser, updateAvatar,
};

// const updateUser = (req, res) => {
//   const { name, about } = req.body;
//   return User.findByIdAndUpdate(
//     req.user._id,
//     { name, about },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       if (!user) {
//         res.status(NotFound).send({ message: 'Пользователь по указанному id не найден' });
//         return;
//       }
//       res.status(200).send({ data: user });
//     })
//     .catch((error) => {
//       if (error.name === 'CastError' || error.name === 'ValidationError') {
//         res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
//       } else {
//         res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

// const updateUser = (req, res, next) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
//         return;
//       }
//       next(new InternalServerError());
//     });
// };
