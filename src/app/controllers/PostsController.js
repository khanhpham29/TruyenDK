const post_model = require('../models/post')
const comment_model = require('../models/comment')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
require('express-async-errors')

class PostsController{
    async posts(req, res, next){
        try{
            const post = await post_model.find({})
            res.json(post)
        }
        catch(error){
            res.status(500)
        }
    }
    formPostsPost(req, res, next){
        res.render('posts/formPost')
    }
    async postsPost(req, res, next){
        try{
            const formdata = req.body
            const post = new post_model(formdata)
            await post.save()
            .then(() =>{
                res.json({ message: "thành công"})
            })
        }catch(error){
            res.status(500)
        }
    }
    async postsGetById(req, res, next){
        try{

            const post =  await post_model.findById({ _id: req.params.postId }).populate(
                "comments"
            )
            .then((post)=>{
                res.render('users/post',{ 
                    post: mongooseToOject(post) 
                })
            })
            // res.json(post)

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
            const comment = new comment_model()
            comment.post = post._id
            comment.content = req.body.content
            comment.userId = req.body.userId
            await comment.save()
            // liên kết vs trang bình luận
            post.comments.push(comment)
            await post.save()
            res.json({ message: "thành công"})
        }catch(error){
            res.status(500).json(error)
        }
    }
}

module.exports = new PostsController