const { Schema, model } = require('mongoose');

const TokenSchema = Schema({

    userId: {
        type: String,
        required: true
    },
    token: {
        type: string,
        required: true
    }
   
});

module.exports = model('Token', TokenSchema);