const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');

const { isMail } = require('../utils/constants');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Введите электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 8,
        message: 'Пароль должен состоять минимум из 8 символов',
      },
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },

    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message:
          'Информация о пользователе должна быть длиной от 2 до 30 символов',
      },
    },

    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => isMail.test(url),
        message: 'Введите URL',
      },
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return Promise.reject();
              });
            }

            return Promise.reject();
          });
      },
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;

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

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// // const validator = require('validator');
// const { isMail } = require('../utils/constants');
// const Unauthorized = require('../errors/Unauthorized');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: 'Жак-Ив Кусто',
//     minLength: 2,
//     maxLength: 30,
//   },
//   about: {
//     type: String,
//     default: 'Исследователь',
//     minLength: 2,
//     maxLength: 30,
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//     validate: {
//       validator: isMail,
//       message: 'Введите валидный линк',
//       },
//     },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: {
//       validator: isMail,
//       message: 'Введите электронный адрес',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//     validate: {
//       validator: ({ length }) => length >= 8,
//       message: 'Пароль должен включать как минимум 8 символов',
//     },
//   },
// }, { versionKey: false });
