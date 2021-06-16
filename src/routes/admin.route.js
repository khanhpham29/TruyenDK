const express = require('express')
const multer = require('multer')

const router = express.Router()
const { urlencoded } = require('body-parser')
const bodyParser = require('body-parser')
const urlencodedParser = express.urlencoded({ extended : true})
const methodOverride = require('method-override')
router.use(methodOverride('_method'))


const adminController = require('../app/controllers/AdminController')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" ||  file.mimetype=='image/jpeg'){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
})
//Manga
//Form add new manga
router.get('/manga/add', adminController.formMangaCreate)
//Add new manga
router.post('/manga/add',upload.single('avatarManga'), adminController.mangaCreate)
//Edit form manga
router.get('/manga/:slug/edit', adminController.formMangaEdit)
//Edit manga
router.post('/manga:slug/edit',upload.single('avatarManga'), adminController.mangaEdit)
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
router.get('/', adminController.index)

//Category
router.get('/categorys/formCategoryCreate', urlencodedParser , adminController.formCategoryCreate)
router.post('/categoryCreate', urlencodedParser, adminController.categoryCreate)
router.get('/categorys/:id/categoryEdit',urlencodedParser , adminController.categoryEdit)
router.put('/categorys/:id',urlencodedParser , adminController.categoryUpdate)
router.delete('/categorys/:id',urlencodedParser , adminController.categoryDelete)
router.get('/categorys',urlencodedParser  , adminController.categorys)


module.exports = router