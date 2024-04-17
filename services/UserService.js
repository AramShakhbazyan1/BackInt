const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchem');
const SECRET = process.env.SECRET || "shhhhh"

class UserService {
    constructor() {
        if (UserService.instance) {
            return UserService.instance;
        }
        UserService.instance = this;
    }

    async findById(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email: email }).lean();
    }

    async checkPassword(user, password) {
        return bcrypt.compare(password, user.password);
    }

    async addUser(data) {
        try {
            const { fullName, email, password } = data;
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const newUser = {
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
            };

            const user = new User(newUser);
            await user.save();
            return user;
        } catch (error) {
            console.error('Error adding user:', error.message);
            throw error;
        }
    }
    
    async updateUser(data, useremail, id) {
        const newHashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
        const existingUser = await this.findByEmail(data.email);
    
        if (existingUser && existingUser.email !== useremail) {
            throw new Error('User with this email already exists');
        }
    
        const newEmail = data.email || useremail; 
        const newFullName = data.fullName || useremail; 
    
        const userUpdate = {
            email: newEmail,
            password: newHashedPassword,
            fullName: newFullName,
        };
        
        try {
            const result = await User.findOneAndUpdate({ _id: id }, userUpdate, { new: true });
            
            if (!result) {
                throw new Error('User not found');
            }
    
            return { success: true, message: 'User updated successfully' };
        } catch (err) {
            console.error('Error updating user:', err.message);
            throw err;
        }
    }

    async deleteUser(email) {
        try {
            const result = await User.deleteOne({ email: email });
            if (result.deletedCount === 0) {
                throw new Error("User not found")
            }
            return { success: true, message: 'Post deleted successfully' };
        } catch (err) {
            console.error('Error deleting user:', err.message);
            throw err;
        }
    }

    toJSON(user) {
        console.log(user);
        if (user) {
            return {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
            };
        }
        return null;
    }

    generateToken(user) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id: user._id }, SECRET, {
                expiresIn: "24h"
            }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    validateToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}


module.exports = new UserService();