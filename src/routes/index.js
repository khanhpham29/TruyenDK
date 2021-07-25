
const adminRouter = require('./admin.route')
const authRouter = require('./auth.route')
const usersRouter = require('./user.route')
const authController = require('../app/controllers/AuthController')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const { requireAuth } = require('../app/middlewares/authMiddleware')


function route(app){
    app.use('*', checkUser)
    app.use('/admin',requireAuth , checkUser , checkAdmin , adminRouter)
    app.use('/', authRouter)
    app.use('/', usersRouter)
}

module.exports = route