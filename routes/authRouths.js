const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate, ValidationError, Joi } = require('express-validation');
const checkAuth = require('../middlewares/checkAuth');



router.post('/login', validate(authController.loginValidation, {}, {}), authController.loginController);
router.get('/me', checkAuth, authController.meController);
router.post('/register', validate(authController.registrationValidation, {}, {}), authController.registerController);
router.post('/logout', authController.logoutController);
router.delete('/delete', checkAuth, authController.deleteUser)
router.put('/update',checkAuth, validate(authController.registrationValidation, {}, {}),authController.updateController);

module.exports = router;