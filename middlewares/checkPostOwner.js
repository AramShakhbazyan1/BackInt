const PostService = require('../services/PostService');
const { ObjectId } = require('mongodb');

async function checkPost(req, res, next) {
    try {
        const post = await PostService.findById(req.body._id);
        const userId = new ObjectId(req.user._id);

        if (!userId.equals(post.authorId)) {
            throw new Error("access denied");
        }

        next();
    } catch (e) {
        res.status(403).send(e.message);
    }
}

module.exports = checkPost;