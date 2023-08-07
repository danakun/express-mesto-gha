// const errorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = statusCode === 500 ? 'Внутренняя ошибка сервера' : err.message;
//   res.status(statusCode).send({ message }); // {message}
//   next();
// };
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = errorHandler;
