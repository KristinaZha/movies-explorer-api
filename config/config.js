const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
const {
  dataMovies = 'mongodb://localhost:27017/moviesdb',
  PORT = 3001,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  limiter,
  dataMovies,
  PORT,
  NODE_ENV,
  JWT_SECRET,
};
