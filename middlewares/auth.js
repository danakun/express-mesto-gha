const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // const errorMessage = 'Необходима авторизация';
  // Проверка авторизации
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // next(new Unauthorized(`${errorMessage}(${authorization})!`),
    // Выбрасываем ошибку через централизованный метод ошибок
    next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); // Верифицикация токена с помощью секретного ключа
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация')); // { message: 'Необходима авторизация' }
  }
  req.user = payload; // Данные пользователя передаются в объект запроса

  return next();
};

module.exports = auth;

// const { isAuthorized } = require('../utils/jwt');
// const Unauthorized = require('../errors/Unauthorized')

// module.exports = async (req, res, next) => {
//     const isAuth = await isAuthorized(req.headers.authorization);
//     if (!isAuth) return res.status(401).send({ message: 'Необходима авторизация'});
// changee it to error class unauth

//     next();
// }

// = (req, res, next) => {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       next(new UnAuthorizedError('Необходима авторизация'));
//       return;
//     }

//     const token = authorization.replace('Bearer ', '');
//     let payload;

//     try {
//       payload = jwt.verify(token, JWT_SECRET);
//     } catch (err) {
//       next(new UnAuthorizedError('Необходима авторизация'));
//       return;
//     }

//     req.user = payload;
//     next();
//   };
