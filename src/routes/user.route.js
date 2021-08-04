const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')

router.post('/test1/:id', usersController.increaseProductCarts)

router.get('/manga/:slug-:chap', usersController.readManga)
router.get('/manga/:slug', usersController.detailManga)
router.post('/addToCart/:id', usersController.addToCart)
router.post('/deleteItem/:id',usersController.deleteItemInCart)
router.get('/category', usersController.categoryOfManga)
router.get('/rental', usersController.rentalOfManga)
router.get('/cart', usersController.getCart)
router.get('/', usersController.index)


router.post('/rentals', usersController.userRentals)

module.exports = router