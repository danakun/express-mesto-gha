const router = require('express').Router();
const {
  getUsers, getMe, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

const { validateId, validateAvatar, validateUser } = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateId, getUser);
router.patch('/me', validateUser, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
