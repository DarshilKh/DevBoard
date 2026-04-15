const router = require('express').Router();
const { body } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getPosts, getPost, createPost, updatePost, deletePost, likePost, getTags
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/tags', getTags);
router.get('/:slug', optionalAuth, getPost);

router.post('/', protect, upload.single('coverImage'), [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required'),
], createPost);

router.put('/:id', protect, upload.single('coverImage'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);

module.exports = router;
