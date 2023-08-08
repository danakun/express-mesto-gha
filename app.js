// require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
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

// Подключаем корс
app.use(cors());

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
