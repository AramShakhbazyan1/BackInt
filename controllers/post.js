const PostService = require('../services/PostService')


class Post {
    constructor() {
        if (Post.instance) {
            return Post.instance;
        }
        Post.instance = this;
    }
    async createPost(req, res, next) {
        const data = {
            title: req.body.title,
            body: req.body.body,
            author: req.user.fullName,
            authorId: req.user._id
        }
        const post = await PostService.addPost(data);
        res.status(200).json(post);
    }

    async deletePost(req, res, next) {
        const post = await PostService.deletePost(req.body._id);

        res.status(200).json(post.message);
    }

    async updatePost(req, res, next) {

        const post = await PostService.updatePost(req.body);
        res.status(200).json(post.message);
    }
    async getPost(req, res, next){
        const post = await PostService.findPost(req.params.id);
        res.status(200).json(post);
    }
}


module.exports = new Post();