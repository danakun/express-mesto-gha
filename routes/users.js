const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

const { validateId, validateAvatar, validateUser } = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/:userId', validateId, getUser);
router.get('/me', getUser);
router.patch('/me', validateUser, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
