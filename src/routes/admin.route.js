const express = require('express')
const multer = require('multer')

const router = express.Router()

const adminController = require('../app/controllers/AdminController')
const upload = require('../app/middlewares/multer')

//--------------------MANGA------------------//

//Search bar manga
router.get('/manga/rentals/search', adminController.search)
//List rentals for manga
router.get('/manga/rentals', adminController.mangaRentals)
//Form create vol books
router.get('/manga/rentals/:slug/addbook', adminController.retailsCreateBooks)
//Create vol books
router.post('/manga/rentals/:slug/createbook',upload.single('avatarNumberVol'), adminController.retailsCreate)
//Details rentals manga
router.get('/manga/rentals/:slug', adminController.detailsRentalManga)
//Form add new manga
router.get('/manga/add', adminController.formMangaCreate)
//Add new manga
router.post('/manga/add',upload.fields([{name: 'avatarManga'},{name: 'avatarNumberVol'}]), adminController.mangaCreate)
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

//----------------------CATEGORY---------------------------//
// Form add new category
router.get('/categorys/formCategoryCreate', adminController.formCategoryCreate)
// Add new  category
router.post('/categoryCreate', adminController.categoryCreate)
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




//-----------------------USERS--------------------//
router.get('/users', adminController.listUsers)
router.get('/users/search', adminController.searchUsers)

// router.get('/users/add', adminController.addUsers)
// router.post('/users/add', adminController.addUsers)


module.exports = router