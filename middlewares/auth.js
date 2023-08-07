const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
   const errorMessage = 'Необходима авторизация';
  // Проверка авторизации
  if (!authorization || !authorization.startsWith(bearer)) {
    next(new Unauthorized(`${errorMessage}(${authorization})!`));
    //next(new Unauthorized('Необходима авторизация')
    return;
  }

  const token = authorization.replace(bearer, '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); // Верифицикация токена с помощью секретного ключа
  } catch (err) {
    return next(
new Unauthorized('Необходима авторизация')); // { message: 'Необходима авторизация' }
  }
  req.user = payload; // Данные пользователя передаются в объект запроса

  return next();
};

module.exports = auth;



// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   const bearer = 'Bearer ';
//   const errorMessage = 'Неправильные почта или пароль';
//   // Проверка наличие и формат заголовка авторизации
//   if (!authorization || !authorization.startsWith(bearer)) {
//     return next(
//       new Unauthorized(`${errorMessage}(${authorization})!`),
//     );
//   }

//   const token = authorization.replace(bearer, '');

//   let payload;

//   try {
//     // Верифицикация токена с использованием секретного ключа
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return next(new Unauthorized(`${errorMessage}!`));
//   }

//   // Данные пользователя сохраняем в объекте запроса
//   req.user = payload;

//   return next();
// };