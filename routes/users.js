const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/user');

// update profile
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), updateUser);

// получение информации  пользователя
router.get('/users/me', getCurrentUser);

module.exports = router;
