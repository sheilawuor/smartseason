const express = require('express');
const router = express.Router({ mergeParams: true });
const { addUpdate, getFieldUpdates } = require('../controllers/updateController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addUpdate);
router.get('/', protect, getFieldUpdates);

module.exports = router;