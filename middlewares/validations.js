const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const { ObjectId } = require('mongoose').Types;

// User login validation
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// id Validation at sign up
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('id не валиден');
    }),
  }),
});

// User Validation
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Поле name должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
    about: Joi.string().required().min(2).max(30)
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
    avatar: Joi.string().required().custom((value, helpers) => {
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
  }),
});

// const validateLikes = celebrate({
//   params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }) });

module.exports = {
  validateId, validateUser, validateAvatar, validateCard, validateLogin,
};
