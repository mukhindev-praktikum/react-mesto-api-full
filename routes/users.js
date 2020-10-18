const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users.js');

router.post('/', createUser);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:userId', getUserById);

module.exports = router;
