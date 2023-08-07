const JWT_SECRET = 'verystrongpassword';
// 96e59903448963a887efb5056d460b2beaa4cec541d28eec1dac84e5b9c5a615

// const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET);

// const isAuthorized = async (token) => {
//   try {
//     const data = await jwt.verify(token, JWT_SECRET);

//     return !!data; // gives back a boolean true or false
//   } catch (err) {
//     return false;
//   }
// };

module.exports = { JWT_SECRET };

// const jwt = require('jsonwebtoken');

// const { CONFIDENTIAL_KEY } = require('../utils/constants');

// const CustomAuthenticationError = require('../errors/CustomAuthenticationError');

// module.exports = (req, _, next) => {
//   const { authorization } = req.headers;
//   const bearer = 'Bearer ';
//   const errorMessage = 'Неправильные почта или пароль';
//   // Проверка наличие и формат заголовка авторизации
//   if (!authorization || !authorization.startsWith(bearer)) {
//     return next(
//       new CustomAuthenticationError(`${errorMessage}(${authorization})!`),
//     );
//   }

//   const token = authorization.replace(bearer, '');
//   let payload;

//   try {
//     // Верифицикация токена с использованием секретного ключа
//     payload = jwt.verify(token, CONFIDENTIAL_KEY);
//   } catch (err) {
//     return next(new CustomAuthenticationError(`${errorMessage}!`));
//   }

//   // Данные пользователя сохраняем в объекте запроса
//   req.user = payload;

//   return next();
// };

// module.exports.auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     next(new Unauthorized('Необходима авторизация'));
//     return;
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     next(new UnAuthorizedError('Необходима авторизация'));
//     return;
//   }

//   req.user = payload;
//   next();
// };
