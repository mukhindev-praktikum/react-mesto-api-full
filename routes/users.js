const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getUsers,
  getUserById,
  getUserByToken,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users.js');

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) return helpers.error('Невалидная ссылка');
      return value;
    }),
  }),
}), updateUserAvatar);

router.get('/me', getUserByToken);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

module.exports = router;
