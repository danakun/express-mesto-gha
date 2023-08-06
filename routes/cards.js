const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateId, validateCard } = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

module.exports = router;
