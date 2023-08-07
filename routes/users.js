const router = require('express').Router();
const {
  getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

const { validateId, validateAvatar, validateUser } = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', validateId, getUser);
router.patch('/me', validateUser, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
