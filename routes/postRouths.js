const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const checkPost = require('../middlewares/checkPostOwner');
const postController = require('../controllers/post');

router.post('/createPost', checkAuth, postController.createPost);
router.delete('/deletePost', checkAuth, checkPost, postController.deletePost);
router.put('/updatePost', checkAuth, checkPost, postController.updatePost);
router.get('/:id', postController.getPost)

module.exports = router;