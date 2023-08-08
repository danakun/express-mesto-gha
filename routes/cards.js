const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validateCard, validateLikes, validateCardId,
} = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateLikes, likeCard);
router.delete('/:cardId/likes', validateLikes, dislikeCard);

module.exports = router;
