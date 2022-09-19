const Movie = require('../models/movie');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

// возвращает все сохранённые текущим  пользователем фильмы GET/movies
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie
    .find({ owner })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((next));
};

// создаёт фильм с переданными в теле
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Проверьте правильность введенных данных.'));
      }
      return next(err);
    });
};

// удаляет сохранённый фильм по id DELETE /movies/_id

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => next(new Error404('Нет фильма по заданному id')))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new Error403('Вы пытаетесь удалить чужой фильм'));
      } else {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new Error404('Переданы некорректные данные при удалении фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  deleteMovie,
  createMovie,
  getMovies,
};
