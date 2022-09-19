const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const Error401 = require('../errors/Error401');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error401('Пройдите авторизацию');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new Error401('Пройдите авторизацию'));
  }

  req.user = payload;
  return next();
};
