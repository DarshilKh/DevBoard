const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile } = require('../controllers/userController');

router.get('/:id', getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
