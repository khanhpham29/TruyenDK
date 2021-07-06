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
router.post('/add',upload.single('avatarManga'), adminController.mangaCreate)
//Form add new chapter of manga: name
router.get('/manga/:slug/addChap',adminController.createChapterManga)
//Add new chapter of manga: name
router.post('/manga/:slug/addChap',upload.array('imgOfManga', 10), adminController.createChapter)
//Infomation of manga :name
router.get('/manga/:slug', adminController.infoManga)
//Infomation all manga from database
router.get('/manga', adminController.manga)
//Index admin
// router.get('/', adminController.index)

router.get('/test', adminController.tam)

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

//Posts

router.get('/formPosts', adminController.formPostsPost)
router.post('/postPost',upload.single('imgPost'), adminController.postsPost)
router.get('/post/:postId', adminController.postsGetById)
router.put('/post/:postId', adminController.postsUpdate)
router.delete('/post/:postId', adminController.postsDelete)
router.post('/post/:postId/comment', adminController.postsComment)
router.get('/posts', adminController.listPosts)

module.exports = router