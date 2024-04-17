const UserService = require('../services/UserService')

async function checkAuth(req, res, next) {
    try {

        const userData = await UserService.validateToken(req.cookies.auth)
        const user = await UserService.findById(userData.id)
        req.user = user
        next()
    } catch(e) {
        res.status(403).send(
            {message: "No auth"}
        )
    }
}

module.exports = checkAuth