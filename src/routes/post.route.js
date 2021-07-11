const express = require('express')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
})
// thế bth sp upload như nào
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

const postsController = require('../app/controllers/PostsController')

router.get('/formPosts', postsController.formPostsPost)
router.post('/postPost',upload.single('imgPost'), postsController.postsPost)
router.get('/post/:postId', postsController.postsGetById)
router.put('/post/:postId', postsController.postsUpdate)
router.delete('/post/:postId', postsController.postsDelete)
router.post('/post/:postId/comment', postsController.postsComment)
router.get('/listPosts', postsController.listPosts)

module.exports = router