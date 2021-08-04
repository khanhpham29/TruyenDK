const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')


router.post('/manga/cancelFollow/:idManga', usersController.cancelFollow)
router.post('/manga/follow/:idManga', requireAuth , usersController.followManga)
router.get('/manga/:slug/:chap', usersController.readManga)
router.get('/manga/:slug', usersController.detailManga)
router.get('/listFollow', usersController.listFollow)
router.get('/notifies', usersController.getNotifies)
router.post('/post/:idPost/comment', requireAuth, usersController.postsComment)
router.post('/post/:idComment/replyComment', usersController.replyComment)
router.post('/addToCart/:id', requireAuth , usersController.addToCart)
router.post('/deleteItem/:id',usersController.deleteItemInCart)
router.get('/category', usersController.categoryOfManga)
router.get('/rental', usersController.rentalOfManga)
router.get('/cart', usersController.getCart)
router.get('/', usersController.index)

router.post('/rentals', usersController.userRentals)

module.exports = router