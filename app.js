const mongoose = require('mongoose');
const express = require('express');
// const path = require('path');
const routes = require('./routes/index');
//  const usersRouter = require('./routes/users');
//  const cardsRouter = require('./routes/cards');
// const { NotFound } = require('./errors/NotFound');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создание экземпляра приложения Express
const app = express();
// Подключаем базу данных монго
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('база данных подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к базе данных');
  });

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.user = {
    _id: '64bc0a9d42e557548b000e87',
  };
  next();
});

// Подключение маршрутов
app.use(routes);
// app.use('/', usersRouter);
// app.use('/', cardsRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// changed the order of use routes to check if it should be after use id !!!!!!!!!!!!!!
