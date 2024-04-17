const { validate, ValidationError, Joi } = require('express-validation')
const UserService = require('../services/UserService')

class Auth {
    constructor() {
        if (Auth.instance) {
            return Auth.instance;
        }
        Auth.instance = this;
    }

    loginValidation = {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .regex(/[a-zA-Z0-9]{4,20}/)
                .required(),
        }),
    }

    registrationValidation = {
        body: Joi.object({
            fullName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{4,20}/).required()
        }),
    };

    async loginController(req, res, next) {
        const {
            email,
            password
        } = req.body

        const user = await UserService.findByEmail(email)
        if (!user) {
            next("user not found")
            return
        }

        const isPaswordCorrect = await UserService.checkPassword(user, password)
        if (!isPaswordCorrect) {
            next("pasword is not corespond")
            return
        }

        const token = await UserService.generateToken(user)
        const expirationTime = 24 * 60 * 60 * 1000; // 1 day

        res.cookie("auth", token, {
            httpOnly: true,
            maxAge: expirationTime
        })
        res.status(200).send(UserService.toJSON(user))
    }

    async meController(req, res, next) {
        res.status(200).send(UserService.toJSON(req.user))
    }
    async updateController(req, res, next) {
        try {
            const updateUser = await UserService.updateUser(req.body, req.user.email, req.user._id)
            if (!updateUser.success) {
                throw new Error(updateUser.message);
                // return res.status(400).send(updateUser.message);
            }
            const user = await UserService.findByEmail(req.body.email)

            const token = await UserService.generateToken(user)
            const expirationTime = 24 * 60 * 60 * 1000; // 1 day

            res.cookie("auth", token, {
                httpOnly: true,
                maxAge: expirationTime
            })
            res.send(UserService.toJSON(user))
        } catch (error) {
            console.error('Error during update:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async registerController(req, res, next) {
        try {
            console.log(req.body);
            const { fullName, email, password } = req.body;

            // const existingUser = await UserService.findByEmail(email);
            // if (existingUser) {
            //     throw new Error('Email is already registered');
            // }

            const newUser = await UserService.addUser({ fullName, email, password });
            const user = await UserService.findByEmail(req.body.email)
            const token = await UserService.generateToken(user)
            const expirationTime = 24 * 60 * 60 * 1000; // 1 day

            res.cookie("auth", token, {
                httpOnly: true,
                maxAge: expirationTime
            })
            console.log(user);
            res.status(201).json({
                message: 'Registration successful',
                user: UserService.toJSON(user),
            });

        } catch (error) {

            console.error('Error during registration:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async logoutController(req, res, next) {
        res.cookie('auth', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).send("Logged out successfully");
    }
    async deleteUser(req, res, next) {
        try {
            const user = await UserService.deleteUser(req.body.email);
            res.cookie('auth', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.send("User deleted successfully")

        } catch (err) {
            console.error('Error deleting user:', err.message);
            res.status(400).send(err.message);
        }
    }
}


module.exports = new Auth();