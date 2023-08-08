const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const User = require('../models/user');

const { SUCCESS } = require('../utils/constants');
const { CREATED } = require('../utils/constants');
// const { BAD_REQUEST } = require('../utils/constants');
// const { NOT_FOUND } = require('../utils/constants');
// const { INTERNAL_SERVER_ERROR } = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

const getUser = (req, res, next) => {
  const { userId } = req.params;
  const loggedInUserId = req.user._id.toString();

  const targetUserId = userId === 'me' ? loggedInUserId : userId;

  User.findById(targetUserId)
    .orFail(() => new NotFound('User not found'))
    .then((user) => {
      const userResponse = {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.status(SUCCESS).send(userResponse);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequest('Invalid user ID'));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// const getUser = (req, res, next) => {
//   const { id } = req.params;
//   User.findById(id)
//     .orFail(() => new NotFound('В базе отсутствует пользователь по заданному id'))
//     .then((user) => res.status(SUCCESS).send({ user }))
//     .catch((err) => {
//       if (err.kind === 'ObjectId') {
//         next(new BadRequest('Передан невалидный id'));
//         // return res.status(BAD_REQUEST).send({
//         //   message: 'Переданы некорректные данные',
//         // });
//       } else {
//         next(err);
//       }
//     });
// };
//       if (err.name === 'DocumentNotFoundError') {
//         return res.status(NOT_FOUND).send({
//           message: 'Пользователь по указанному id не найден',
//         });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({
//           message:
//             'Внутренняя ошибка сервера',
//         });
//     'Переданы некорректные данные'
// };

// Получение всех пользователей
const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(SUCCESS).send({ users }))
  .catch((err) => next(err));
// res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким имейлом уже существует'));
        return;
      }
      next(err);
    });
};

// login пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      // const greeting = `Welcome back, ${user.name}!`;
      res.send({ token });
    })
    .catch(next);
};

// Редактирование пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFound('Пользователь по заданному id отсутствует в базе'))
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map((error) => error.message);
        next(new BadRequest(validationErrors));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getMe,
  getUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
