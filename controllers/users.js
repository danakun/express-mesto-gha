const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');

const createUser = (req, res, next) => {
return User.create(req.body)
.then((user) => res.status(201).send(user))
.catch((err) => {
  if(err.name === 'ValidationError') {
      next (new BadRequest('При создании пользователя переданы некорректные данные'));
    //res.status(BadRequest).send({ message: `Error validating user ${err}`})
    res.status(400).send(err)
  } else {
      next (new InternalServerError());
    //res.status(500).send({ message: `Internal server error ${err}`})
}
});
};

//  const createUser = (req, res) =>
// return User
//   .create(req.body)
//   .then((user) => res.status(201).send(user))
//   .catch((error) => {
//     if (error.name === 'ValidationError') {
//       res.status(BadRequest).send({
//         message: `Переданы некорректные данные при создании пользователя: ${error}`,
//       });
//     } else {
//       res.status(InternalServerError).send({ message: 'Ошибка сервера' });
//     }
//   });

// class InternalServerError extends Error {
//   constructor(status = 500, message = 'Internal Server Error') {
//     super();
//     this.status = status;
//     this.message = message;
//     this.name = this.constructor.name;
//   }
// }

// class NotFound extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'NotFound';
//     this.status = 404;
//   }
// }

const getUser = (req, res) => {
 return User.findById(req.params.userId)
 .orFail(() => {
  throw new NotFound();
 })
 .then((user) => res.status(200).send(user))
 .catch((err) => {
  if(err.name === 'NotFound') {
    res.status(err.status).send({ message: `${err}: Пользователь по указанному id не найден`})
   } else {
    res.status(500).send({ message: `Internal server error ${err}`});
  }
 })
};

const getUsers = (req, res, next) => {
return User.find({})
.orFail(() => {
  throw new InternalServerError();
 })
.then((users) => res.status(200).send(users))
 .catch(() => {
   next (new InternalServerError())
 })
};


const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('При обновлении профиля переданы некорректные данные'));
        return;
      }
      next(new InternalServerError());
    });
};

const updateAvatar = (req, res, next) => {
    const { avatar } = req.body;
    return User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequest('При обновлении аватара переданы некорректные данные'));
          return;
        }
        next(new InternalServerError());
      });
  };


module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar }