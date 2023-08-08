const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const { isMail } = require('../utils/constants');

// User login validation
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

// user id Validation
const validateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});
// card id validation
const validateCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
});

// sign up validation
const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(isMail).optional(),
  }),
});

// User Validation
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'any.required': 'Поле name должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .message({
        'any.required': 'Поле about должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
  }),
});

// Avatar Validation
const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Линк на аватар не валиден');
    }),
  }),
});

// Card Validation
const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.required': 'Поле name должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Линк не валиден');
    })
      .messages({
        'string.required': 'Поле link должно быть заполнено',
      }),
  }).unknown(true),
});

const validateLikes = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
});

module.exports = {
  validateId,
  validateUser,
  validateAvatar,
  validateCard,
  validateLogin,
  validateSignUp,
  validateLikes,
  validateCardId,
};
