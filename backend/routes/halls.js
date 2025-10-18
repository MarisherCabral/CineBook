const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/authMiddleware');
const { getHalls, addHall, updateHall, deleteHall } = require('../controllers/hallController');

router.get('/', getHalls);           // All users
router.post('/', auth, adminOnly, addHall);
router.put('/:id', auth, adminOnly, updateHall);
router.delete('/:id', auth, adminOnly, deleteHall);

module.exports = router;
