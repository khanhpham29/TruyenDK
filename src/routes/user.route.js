const express = require('express')
const router = express.Router()
const upload = require('../app/middlewares/multer')

const { requireAuth } = require('../app/middlewares/authMiddleware')
const { checkUser } = require('../app/middlewares/authMiddleware')
const { checkMember } = require('../app/middlewares/authMiddleware')
const { checkAdmin } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/user/UserMangaController')
const accountController = require('../app/controllers/user/AccountController')
const userRentalController = require('../app/controllers/user/UserRentalController')
const userPostController = require('../app/controllers/user/UserPostController')

// MANGA
router.get('/', usersController.index)
router.get('/manga/searchManga', usersController.searchManga)
router.post('/manga/favourite/:idManga', usersController.favourite)
router.post('/manga/cancelFollow/:idManga', usersController.cancelFollow)
router.post('/manga/follow/:idManga', requireAuth , usersController.followManga)
router.get('/manga/:slug/:chap', usersController.readManga)
router.get('/manga/:slug', usersController.detailManga)
router.get('/category', usersController.categoryOfManga)
router.get('/listFollow', usersController.listFollow)
router.get('/history', usersController.history)
router.post('/history/:idManga', usersController.postHistory)
router.get('/notifies', usersController.getNotifies)



//  ACCOUNT
//Xem thông tin tài khoản
router.get('/account', accountController.userAccount)
router.post('/account/update',upload.single('avatar'), accountController.userAccountUpdate)
//Xem lịch sử mua hàng
router.get('/account/rentals-history', accountController.viewRentalsHistory)
//Xem chi tiết
router.get('/account/rentals-history/:id/detail', accountController.detailRentalsHistory)
//đổi mật khẩu
router.get('/account/change-password', accountController.formChangePassword)
router.post('/account/change-password', accountController.ChangePassword)


//Bài post - comment
router.post('/post/:idUser/likeCommnet', requireAuth, userPostController.likeComment)
router.post('/post/:idPost/comment', requireAuth, userPostController.postsComment)
router.post('/post/:idComment/replyComment', requireAuth , userPostController.replyComment)


// RENTAL
router.post('/addToCart/:id', requireAuth , userRentalController.addToCart)
router.post('/cart/plus/:id', userRentalController.increaseProductCarts)
router.post('/cart/minus/:id', userRentalController.decreaseProductCarts)
router.post('/deleteItem/:id',userRentalController.deleteItemInCart)
router.get('/rental', userRentalController.rentalOfManga)
router.post('/rentals', userRentalController.userRentals)
router.get('/rental/:slug', userRentalController.detailMangaRental)
router.get('/cart', userRentalController.getCart)

module.exports = router