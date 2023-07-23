const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
// const Router = require('./routes/index');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
// const { NotFound } = require('./errors/NotFound');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '64bc0a9d42e557548b000e87',
  };
  next();
});
//   app.use('*', (req, res, next) => next(
//     res.status(NotFound).send({ message: 'Страница не найдена' }),
//   ));
//   next();
// });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
