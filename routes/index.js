// const mongoose = require('mongoose');
// const express = require('express');

// const path = require('path');
// const usersRouter = require('./routes/users');
//  const cardsRouter = require('./routes/cards');

//  Слушаем 3000 порт
// const { PORT = 3000 } = process.env;
// const app = express();

// mongoose.connect('mongodb://localhost:27017/mydb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', usersRouter);

// app.listen(PORT, () => {
//   // Если всё работает, консоль покажет, какой порт приложение слушает
//   console.log(`App listening on port ${PORT}`);
// });

const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
