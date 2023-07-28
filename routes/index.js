const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND } = require('../utils/constants');
// const NotFound = require('../errors/NotFound');

// Обработка запросов пользователя
router.use('/users', userRouter);
// Обработка запросов карточек
router.use('/cards', cardRouter);

// Обработка запросов несуществующих маршрутов
router.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена.' });
});

//   app.use('*', (req, res, next) => next(
//     res.status(NOT_FOUND).send({ message: 'Страница не найдена' }),
//   ));
//   next();
// });

module.exports = router;
