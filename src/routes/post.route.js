const express = require('express')
const router = express.Router()



const postsController = require('../app/controllers/PostsController')

router.get('/formPosts', postsController.formPostsPost)
router.post('/postsPost', postsController.postsPost)
router.get('/post/:postId', postsController.postsGetById)
router.put('/post/:postId', postsController.postsUpdate)
router.delete('/post/:postId', postsController.postsDelete)
router.post('/post/:postId/comment', postsController.postsComment)
router.get('/post', postsController.posts)


module.exports = router