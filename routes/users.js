const router = require('express').Router();
const {
  createUser, getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
// router.get('/:id', getUser);
router.post('/users', createUser);
// router.patch('/users/me', updateUser);
// router.patch('/users/me/avatar', updateAvatar);
router.patch('/me', updateUser);
router.patch('me/avatar', updateAvatar);

module.exports = router;
