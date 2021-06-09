const express = require('express')
const router = express.Router()
const { urlencoded } = require('body-parser')
const bodyParser = require('body-parser')
const urlencodedParser = express.urlencoded({ extended : true})
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

const adminController = require('../app/controllers/AdminController')

//Category

router.get('/categorys/formCategoryCreate', urlencodedParser , adminController.formCategoryCreate)
router.post('/categoryCreate', urlencodedParser, adminController.categoryCreate)
router.get('/categorys/:id/categoryEdit',urlencodedParser , adminController.categoryEdit)
router.put('/categorys/:id',urlencodedParser , adminController.categoryUpdate)
router.delete('/categorys/:id',urlencodedParser , adminController.categoryDelete)
router.get('/categorys',urlencodedParser  , adminController.categorys)

//Manga
router.get('/manga/formMangaCreate', adminController.formMangaCreate)
router.post('/mangaCreate', adminController.mangaCreate)
router.get('/', adminController.index)

module.exports = router