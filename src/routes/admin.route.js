const express = require('express')
const multer = require('multer')

const router = express.Router()

const mangaController = require('../app/controllers/admin/MangaController')
const categoryController = require('../app/controllers/admin/CategoryController')
const rentalController = require('../app/controllers/admin/RentalController')
const postController = require('../app/controllers/admin/PostController')
const mangaRentalController = require('../app/controllers/admin/MangaRentalController')
const upload = require('../app/middlewares/multer')

//--------------------MANGA------------------//


//Search bar manga
router.get('/manga/searchManga', mangaController.searchManga)
//Form add new manga
router.get('/manga/add', mangaController.formMangaCreate)
//Add new manga
router.post('/manga/add',upload.single('avatarManga'), mangaController.mangaCreate)
//Edit form manga
router.get('/manga/:slug/edit', mangaController.formMangaEdit)
//Edit manga
router.put('/manga/:slug',upload.single('avatarManga'), mangaController.mangaEdit)
//Form add new chapter of manga: name
router.get('/manga/:slug/addChap',mangaController.createChapterManga)
//Add new chapter of manga: name
router.post('/manga/:slug/addChap',upload.array('imgOfManga', 10), mangaController.createChapter)
//Read chapter manga
router.get('/manga/:tentruyen/:chapter', mangaController.readChap)
//Infomation of manga :name
router.get('/manga/:slug', mangaController.infoManga)
//Infomation all manga from database
router.get('/manga', mangaController.manga)
//Index admin
// router.get('/', MangaController.index)


//-------------------------MANGA-RENTAL------------------------//
//Search rentals
router.get('/rentals/searchMangaRental', mangaRentalController.searchMangaRental)
//Form create new book rental
router.get('/rentals/createBook', mangaRentalController.formCreateBook)
// create book rental
router.post('/rentals/:slug',upload.single('avatarMangaRental'), mangaRentalController.createMangaRental)
// add new book rental
router.get('/rentals/:slug/addNewBook', mangaRentalController.formAddNewBook)
// create book rental
router.post('/rentals/:slug/addNewBook',upload.single('avatarMangaRental'), mangaRentalController.AddNewBook)
// form edit book rental
router.get('/rentals/:slug/edit/:episode', mangaRentalController.formUpdateMangaRental)
// edit book rental
router.post('/rentals/:slug/edit/:episode',upload.single('avatarMangaRental'), mangaRentalController.EditMangaRental)
// Detail list book rental
router.get('/rentals/:slug/listRental', mangaRentalController.listMangaRentals)

//List rentals for manga
router.get('/rentals', mangaRentalController.mangaRentals)

//----------------------CATEGORY---------------------------//
// Form add new category
router.get('/categories/formCategoryCreate', categoryController.formCategoryCreate)
// Add new  category
router.post('/categories/categoryCreate', categoryController.categoryCreate)
// form edit 
router.get('/categories/:id/categoryEdit', categoryController.categoryEdit)
// Post checkbox delete
router.post('/categories/handleFormActions', categoryController.handleFormActions)
// updated
router.put('/categories/:id', categoryController.categoryUpdate)
// Restore
router.patch('/categories/:id/categoryRestore', categoryController.categoryRestore)
// Delete soft
router.delete('/categories/:id', categoryController.categoryDelete)
// Delete force
router.delete('/categories/:id/categoryForceDelete', categoryController.categoryForceDelete)
// form Trash
router.get('/categories/categoryTrash',categoryController.categoryTrash)
// index
router.get('/categories', categoryController.categories)

//-------------------------RENTAL------------------------//

router.get('/rentals/new', rentalController.newRentals)
router.post('/rentals/new/:id', rentalController.confirmNewRentals)
router.get('/rentals/confirm', rentalController.confirmRentals)
router.post('/rentals/confirm/:id', rentalController.confirmToRentals)
router.get('/rentals/pay', rentalController.payRentals)
router.get('/rentals/pay/:id/detail', rentalController.detailPayRentals)
router.post('/rentals/pay/:id/', rentalController.paidOneBook)
router.post('/rentals/pay/:id/book', rentalController.payBookRentals)
router.post('/rentals/:id/reject', rentalController.rejectRentals)
router.get('/rentals/list/:id/detail', rentalController.detailRentals)
router.get('/rentals/list', rentalController.userRentalsList)



//-----------------------USERS--------------------//
router.get('/users', mangaController.listUsers)
router.get('/users/search', mangaController.searchUsers)

//-----------------------POSTS--------------------//
router.get('/formPosts', postController.formPostsPost)
router.post('/postPost',upload.single('imgPost'), postController.postsPost)
router.get('/post/:idPost', postController.postsGetById)
router.put('/post/:idPost', postController.postsUpdate)
router.delete('/post/:idPost', postController.postsDelete)
router.post('/post/:idPost/comment', postController.postsComment)
router.get('/posts', postController.listPosts)

module.exports = router