const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
// const Router = require('./routes/index');
const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '6411a0175f26d1ed6a973834',
  };
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
