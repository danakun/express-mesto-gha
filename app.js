// require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
// const path = require('path');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
// const auth = require('./middlewares/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создание экземпляра приложения Express
const app = express();
// Подключаем rate-limiter
app.use(limiter);
// Подключаем защиту зашоловков
app.use(helmet());
// Подключаем базу данных монго
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('база данных подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к базе данных');
  });

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));   -подключение статичного фронта
// app.use((req, res, next) => {                              -хардкод айдишки из пр13
//   req.user = {
//     _id: '64bc0a9d42e557548b000e87',
//   };
//   next();
// });

// Подключение маршрутов без авторизации
// app.post('/signin', login);
// app.post('/signup', createUser);
// авторизация
// app.use(auth);

// Подключение маршрутов, которым авторизация нужна
app.use(router);
// app.use('/', usersRouter);
// app.use('/', cardsRouter);
app.use(errors()); // define errors

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
