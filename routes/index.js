const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');

// Обработка запросов пользователя
router.use('/users', userRouter);
// Обработка запросов карточек
router.use('/cards', cardRouter);

// Обработка запросов несуществующих маршрутов
router.use('/*', (req, res) => {
  res.status(NotFound).send({ message: `${NotFound}: Страница не найдена.` });
});

//   app.use('*', (req, res, next) => next(
//     res.status(NotFound).send({ message: 'Страница не найдена' }),
//   ));
//   next();
// });

module.exports = router;
