const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error409 = require('../errors/Error409');
const Error401 = require('../errors/Error401');

const { NODE_ENV, JWT_SECRET } = require('../config/config');

// проверяет переданные в теле почту и пароль и возвращает JWT POST /signin
const login = (req, res, next) => {
  console.log('request.body: (login) ', req.body);
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('function - login ==>', user);
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new Error401('Данные неверны'));
    });
};

// создаёт пользователя с переданными в телe email, password и name POST /signup
const createUser = (req, res, next) => {
  console.log('request.body: ', req.body);

  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error404('Проверьте данные'));
      }
      if (err.code === 11000) {
        return next(new Error409('Пользователь уже существует'));
      }
      return next(err);
    });
};

// возвращает информацию о пользователе (email и имя) GET/users/me
const getCurrentUser = (req, res, next) => {
  console.log(req.matched);
  User
    .findById(req.user._id)
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// обновляет информацию о пользователе (email и имя)PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error404('Пользователь не существует');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new Error400('Имя или описание не соответствует требованию.'));
      }
      if (err.kind === 'ObjectId') {
        return next(new Error400('ID пользователя передано некорретно.'));
      }
      return next(err);
    });
};

module.exports = {
  login,
  createUser,
  getCurrentUser,
  updateUser,
};
