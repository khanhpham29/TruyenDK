const express = require('express')
const router = express.Router()
const upload = require('../app/middlewares/multer')

const { requireAuth } = require('../app/middlewares/authMiddleware')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')



router.post('/cart/plus/:id', usersController.increaseProductCarts)
router.post('/cart/minus/:id', usersController.decreaseProductCarts)

router.get('/account', usersController.userAccount)
router.post('/account/update',upload.single('avatar'), usersController.userAccountUpdate)

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