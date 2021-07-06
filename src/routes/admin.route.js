const express = require('express')
const multer = require('multer')

const router = express.Router()

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
// router.get('/', adminController.index)

//Category
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

router.get('/', adminController.index)



module.exports = router