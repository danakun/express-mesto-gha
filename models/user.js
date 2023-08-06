const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
const { isMail } = require('../utils/constants');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return /https?:\/\/(www.)?[\w._~:/?#[\]@!$&'()*+,;=]*#?/.test(link);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isMail,
      message: 'Введите электронный адрес',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: ({ length }) => length >= 8,
      message: 'Пароль должен включать как минимум 8 символов',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
