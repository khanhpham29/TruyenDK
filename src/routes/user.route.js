const express = require('express')
const router = express.Router()
const upload = require('../app/middlewares/multer')

const { requireAuth } = require('../app/middlewares/authMiddleware')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')


router.post('/manga/cancelFollow/:idManga', usersController.cancelFollow)
router.post('/manga/follow/:idManga', requireAuth , usersController.followManga)
router.get('/manga/:slug/:chap', usersController.readManga)
router.get('/manga/:slug', usersController.detailManga)

router.post('/cart/plus/:id', usersController.increaseProductCarts)
router.post('/cart/minus/:id', usersController.decreaseProductCarts)

router.get('/account', usersController.userAccount)
router.post('/account/update',upload.single('avatar'), usersController.userAccountUpdate)

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

router.post('/rentals', usersController.userRentals)

module.exports = router