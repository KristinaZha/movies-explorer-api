const router = require('express').Router();
const entry = require('./auth');
const auth = require('../middlewares/auth');
const Error404 = require('../errors/Error404');

router.use(entry);

router.use(auth);

router.use(require('./users'));
router.use(require('./movie'));

router.use('*', (_, __, next) => next(new Error404('Такой страницы не существует.')));

module.exports = router;
