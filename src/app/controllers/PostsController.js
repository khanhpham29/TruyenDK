const post_model = require('../models/post')
const comment_model = require('../models/comment')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const multer = require('multer')
class PostsController{
    async listPosts(req, res, next){
        try{
            const sort = { createdAt: -1}
            const posts = post_model.find({}).sort(sort)
            .then((posts) =>{
                res.render("posts/listPosts",{
                    posts: multipleMongooseToOject(posts)
                })
            })
        }
        catch(error){
            console.log(error)
            res.status(500)
        }
    }

    formPostsPost(req, res, next){
        res.render('posts/formPost')
    }
    async postsPost(req, res, next){
        try{
            const post = new post_model({
                title: req.body.title,
                content: req.body.content,
                imgPost: req.file.filename
            })
            await post.save()
            .then((post) =>{
                res.status(200).send({ 
                    message: "Đăng bài thành công",
                    post: mongooseToOject(post)
                })
            })
        }catch(error){
            res.status(500).json({err: error})
        }
    }
    
    async postsGetById(req, res, next){
        try{
            const post =  await post_model.findById({ _id: req.params.postId }).populate({
                path: "comments",
                options: { sort: { createdAt: -1 } }
            })
            .then((post)=>{
                res.render('posts/comments',{ 
                    post: mongooseToOject(post),
                })
            })
        }catch(error){
            console.log(error)
            res.status(500)
        }
    }
    async postsUpdate(req, res, next){
        try{
            const post = await post_model.findByIdAndUpdate({
                _id: req.params.postId
            }, req.body,{
                new: true,
                runValidators: true,
            })
            res.json(post)
        }catch(error){
            
        }
    }
    async postsDelete(req, res, next){
        try{
            const post = await post_model.findByIdAndRemove({
                _id: req.params.postId
            })
            res.json(post)
        }
        catch(error){
            res.status(500).json(error)
        }
    }
    async postsComment(req, res, next){
        try{
            const post = await post_model.findById(req.params.postId)
            // create a comment
            const comment = new comment_model({
                postId: post._id,
                content: req.body.content,
                userId: req.body.userId,
            })
            
            await comment.save()
            // liên kết vs trang bình luận
            post.comments.push(comment)
            await post.save()
            res.status(200).json({ 
                comment: mongooseToOject(comment)
            })
        }catch(error){
            res.status(500).json(error)
        }
    }
}

module.exports = new PostsController