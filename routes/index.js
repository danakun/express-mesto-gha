const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

// const { NOT_FOUND } = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateLogin, validateSignUp } = require('../middlewares/validations');

// Обработка запросов на создание пользователя и логин
router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateLogin, login);
// Мидлвара аутентификации пользователя
router.use(auth);
// Обработка запросов пользователя
router.use('/users', userRouter);
// Обработка запросов карточек
router.use('/cards', cardRouter);
// Обработка запросов несуществующих маршрутов
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
