const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/AdminController')

//Category

router.get('/categorys/formCategoryCreate' , adminController.formCategoryCreate)
router.post('/categoryCreate', adminController.categoryCreate)
router.get('/categorys/:id/categoryEdit' , adminController.categoryEdit)
router.post('/categorys/handle-form-actions',adminController.handleFormActions)
router.put('/categorys/:id' , adminController.categoryUpdate)
router.patch('/categorys/:id/categoryRestore' , adminController.categoryRestore)
router.delete('/categorys/:id' , adminController.categoryDelete)
router.delete('/categorys/:id/categoryForceDelete', adminController.categoryForceDelete)
router.get('/categorys/categoryTrash', adminController.categoryTrash)
router.get('/categorys', adminController.categorys)

//Manga
router.get('/manga/formMangaCreate', adminController.formMangaCreate)
router.post('/mangaCreate', adminController.mangaCreate)
router.get('/', adminController.index)

module.exports = router