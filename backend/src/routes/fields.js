const express = require('express');
const router = express.Router();
const { getAllFields, getMyFields, createField, getAllAgents } = require('../controllers/fieldController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllFields);
router.get('/mine', protect, getMyFields);
router.post('/', protect, adminOnly, createField);
router.get('/agents', protect, adminOnly, getAllAgents);

module.exports = router;