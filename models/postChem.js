const { Schema, model } = require('mongoose');

const PostSchema = Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    lastModification: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = model('Post', PostSchema);