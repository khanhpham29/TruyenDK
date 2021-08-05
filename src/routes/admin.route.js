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
//Search rentals
router.get('/rentals/searchMangaRental', adminController.searchMangaRental)
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
router.get('/categories/formCategoryCreate', adminController.formCategoryCreate)
// Add new  category
router.post('/categories/categoryCreate', adminController.categoryCreate)
// form edit 
router.get('/categories/:id/categoryEdit', adminController.categoryEdit)
// Post checkbox delete
router.post('/categories/handleFormActions', adminController.handleFormActions)
// updated
router.put('/categories/:id', adminController.categoryUpdate)
// Restore
router.patch('/categories/:id/categoryRestore', adminController.categoryRestore)
// Delete soft
router.delete('/categories/:id', adminController.categoryDelete)
// Delete force
router.delete('/categories/:id/categoryForceDelete', adminController.categoryForceDelete)
// form Trash
router.get('/categories/categoryTrash', adminController.categoryTrash)
// index
router.get('/categories', adminController.categories)

//-------------------------RENTAL------------------------//

router.get('/rentals/new', adminController.newRentals)
router.post('/rentals/new/:id', adminController.confirmNewRentals)
router.get('/rentals/confirm', adminController.confirmRentals)
router.post('/rentals/confirm/:id', adminController.confirmToRentals)
router.get('/rentals/pay', adminController.payRentals)
router.get('/rentals/pay/:id/detail', adminController.detailPayRentals)
router.post('/rentals/pay/:id/', adminController.paidOneBook)
router.post('/rentals/pay/:id/book', adminController.payBookRentals)





router.get('/rentals/comfirm/:id/detail', adminController.xemChiTiet)

router.post('/rentals/:id/reject', adminController.rejectRentals)
router.get('/rentals/list/:id/detail', adminController.detailRentals)
router.get('/rentals/list', adminController.userRentalsList)



//-----------------------USERS--------------------//
router.get('/users', adminController.listUsers)
router.get('/users/search', adminController.searchUsers)

//-----------------------POSTS--------------------//
router.get('/formPosts', adminController.formPostsPost)
router.post('/postPost',upload.single('imgPost'), adminController.postsPost)
router.get('/post/:idPost', adminController.postsGetById)
router.put('/post/:idPost', adminController.postsUpdate)
router.delete('/post/:idPost', adminController.postsDelete)
router.post('/post/:idPost/comment', adminController.postsComment)
router.get('/posts', adminController.listPosts)

module.exports = router