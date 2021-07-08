
const truyensRouter = require('./mangas.route')
const adminRouter = require('./admin.route')
const authRouter = require('./auth.route')
const usersRouter = require('./user.route')
const authController = require('../app/controllers/AuthController')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const { requireAuth } = require('../app/middlewares/authMiddleware')


function route(app){
    app.use('*', checkUser )
    app.use('/truyens', truyensRouter)
    app.use('/admin',requireAuth , checkUser , checkAdmin , adminRouter)
    app.use('/', authRouter)
    app.use('/users', usersRouter)
}

module.exports = route