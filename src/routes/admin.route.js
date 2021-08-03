const express = require('express')
const multer = require('multer')

const router = express.Router()

const adminController = require('../app/controllers/AdminController')
const upload = require('../app/middlewares/multer')

//--------------------MANGA------------------//


//Search bar manga
router.get('/manga/searchManga', adminController.searchManga)
//Form add new manga
router.get('/manga/add', adminController.formMangaCreate)
//Add new manga
router.post('/manga/add',upload.single('avatarManga'), adminController.mangaCreate)
//Edit form manga
router.get('/manga/:slug/edit', adminController.formMangaEdit)
//Edit manga
router.put('/manga/:slug',upload.single('avatarManga'), adminController.mangaEdit)
//Form add new chapter of manga: name
router.get('/manga/:slug/addChap',adminController.createChapterManga)
//Add new chapter of manga: name
router.post('/manga/:slug/addChap',upload.array('imgOfManga', 10), adminController.createChapter)
//Read chapter manga
router.get('/manga/:tentruyen/:chapter', adminController.readChap)
//Infomation of manga :name
router.get('/manga/:slug', adminController.infoManga)
//Infomation all manga from database
router.get('/manga', adminController.manga)
//Index admin
// router.get('/', adminController.index)


//-------------------------MANGA-RENTAL------------------------//
//Form create manga rental
router.get('/rentals/createMangaRental', adminController.formCreateMangaRental)
// create manga rental
router.post('/rentals/:slug/',upload.single('avatarMangaRental'), adminController.createMangaRental)
// form edit manga rental
router.get('/rentals/:slug/edit/:episode', adminController.formUpdateMangaRental)
// edit manga rental
router.post('/rentals/:slug/edit/:episode',upload.single('avatarMangaRental'), adminController.EditMangaRental)
// Detail list manga rental
router.get('/rentals/:slug/listRental', adminController.listMangaRentals)

//List rentals for manga
router.get('/rentals', adminController.mangaRentals)

//----------------------CATEGORY---------------------------//
// Form add new category
router.get('/categorys/formCategoryCreate', adminController.formCategoryCreate)
// Add new  category
router.post('/categorys/categoryCreate', adminController.categoryCreate)
// form edit 
router.get('/categorys/:id/categoryEdit', adminController.categoryEdit)
// Post checkbox delete
router.post('/categorys/handleFormActions', adminController.handleFormActions)
// updated
router.put('/categorys/:id', adminController.categoryUpdate)
// Restore
router.patch('/categorys/:id/categoryRestore', adminController.categoryRestore)
// Delete soft
router.delete('/categorys/:id', adminController.categoryDelete)
// Delete force
router.delete('/categorys/:id/categoryForceDelete', adminController.categoryForceDelete)
// form Trash
router.get('/categorys/categoryTrash', adminController.categoryTrash)
// index
router.get('/categorys', adminController.categorys)

//-------------------------RENTAL------------------------//

router.get('/rentals/new', adminController.newRentals)
router.post('/rentals/new/:id', adminController.confirmNewRentals)
router.get('/rentals/confirm', adminController.confirmRentals)
router.post('/rentals/confirm/:id', adminController.confirmToRentals)
router.get('/rentals/pay', adminController.payRentals)
router.get('/rentals/pay/:id/detail', adminController.detailPayRentals)
router.post('/rentals/pay/:id/', adminController.paidOneBook)
router.post('/rentals/pay/:id/book', adminController.payBookRentals)



router.post('/rentals/:id/reject', adminController.rejectRentals)
router.post('/rentals/:id/return', adminController.returnRentals)
router.get('/rentals/:id/detail', adminController.detailRentals)
router.post('/rentals/:id', adminController.controlRentals)
router.get('/rentals/list', adminController.userRentalsList)
router.get('/rentals/list/finally', adminController.finallyRentals)



//-----------------------USERS--------------------//
router.get('/users', adminController.listUsers)
router.get('/users/search', adminController.searchUsers)

//Posts
router.get('/formPosts', adminController.formPostsPost)
router.post('/postPost',upload.single('imgPost'), adminController.postsPost)
router.get('/post/:postId', adminController.postsGetById)
router.put('/post/:postId', adminController.postsUpdate)
router.delete('/post/:postId', adminController.postsDelete)
router.post('/post/:postId/comment', adminController.postsComment)
router.get('/posts', adminController.listPosts)

module.exports = router