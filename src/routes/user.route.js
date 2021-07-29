const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')

router.get('/manga/:slug-:chap', usersController.readManga)
router.get('/manga/:slug', usersController.detailManga)
router.post('/addToCart/:id', usersController.addToCart)
router.post('/deleteItem/:id',usersController.deleteItemInCart)
router.get('/category', usersController.categoryOfManga)
router.get('/rental', usersController.rentalOfManga)
router.get('/cart', usersController.getCart)
router.get('/', usersController.index)


module.exports = router