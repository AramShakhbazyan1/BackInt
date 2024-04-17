const express = require('express');
const mongoose = require('mongoose');
const { validate, ValidationError, Joi } = require('express-validation');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRouths');
const postRoutes = require('./routes/postRouths');


const app = express();
const PORT = process.env.PORT || 3003;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/Ac";


app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/post', postRoutes);


app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    console.log(err)
    return res.status(500).json({})
})

const mongoDB = async () => {
    try {
        const conn = await mongoose.connect(`${DATABASE_URL}`);
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`);
        return conn;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
mongoDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
