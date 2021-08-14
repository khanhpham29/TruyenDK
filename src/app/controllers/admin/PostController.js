const Manga = require('../../models/Manga')
const detailmanga_model = require('../../models/DetailManga')
const ImageDetail = require('../../models/ImageDetail')
const categoies_model = require('../../models/CategoryManga')
const rental_model = require('../../models/MangaRental')
const User_Model = require('../../models/User')
const Cart_Model = require('../../models/Cart')
const DetailsCart_Model = require('../../models/DetailCart')
const post_model = require('../../models/post')
const comment_model = require('../../models/comment')
const book_model = require('../../models/book')
const follow_model = require('../../models/FollowManga')
const notifies_model = require('../../models/Notifies')
const multer = require('multer')
const path = require('path')

const { multipleMongooseToOject } = require('../../../util/mongoose')
const { mongooseToOject } = require('../../../util/mongoose')
const mongoose = require('mongoose')
const { PromiseProvider } = require('mongoose')
const { listeners } = require('../../models/Manga')


class PostController{
    async listPosts(req, res, next){
        try{
            const sort = { createdAt: -1}
            const posts = post_model.find({}).sort(sort)
            .then((posts) =>{
                res.render("admins/posts/listPosts",{
                    posts: multipleMongooseToOject(posts),
                    layout: 'admin'
                })
            })
        }
        catch(error){
            console.log(error)
            res.status(500)
        }
    }
    formPostsPost(req, res, next){
        const mangas = Manga.find({posted: false})
        .then((mangas)=>{
            res.render('admins/posts/formPost',{
                mangas: multipleMongooseToOject(mangas),
                layout: 'admin'
            })
        })
        .catch((err)=>{
            res.status(400).json(err)
        })
    }
    async postsPost(req, res, next){
        const manga = Manga.findOne({nameManga: req.body.nameManga})
        .then(async (manga)=>{
            const post = new post_model({
                title: req.body.title,
                content: req.body.content,
                imgPost: req.file.filename,
            })
            await post.save()
            .then((post) =>{
                const postNew = post_model.updateOne({_id: post._id},{
                    idManga: manga._id
                })
                Manga.updateOne({_id: manga._id},{
                    posted: true,
                })
                detailmanga_model.updateOne({idManga: manga._id},{
                    idPost: post._id
                })
                .then((postNew)=>{
                    res.status(200).json({
                        message: "Đăng bài thành công",
                        post: postNew
                    })
                })
            })
            .catch((err) => {
                res.json(err)
            })
        })
        .catch((err)=>{
            res.json(err)
        })
    }
    async postsGetById(req, res, next){
        try{
            const post =  await post_model.findById({ _id: req.params.idPost }).populate({
                path: "comments",
                options: { sort: { createdAt: -1 } }
            })
            .then((post)=>{
                res.render('admins/posts/comments',{ 
                    post: mongooseToOject(post),
                    layout: 'admin'
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
                _id: req.params.idPost
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
                _id: req.params.idPost
            })
            res.json(post)
        }
        catch(error){
            res.status(500).json(error)
        }
    }
    async postsComment(req, res, next){
        try{
            const post = await post_model.findById(req.params.idPost)
            // create a comment
            const comment = new comment_model({
                idPost: post._id,
                content: req.body.content,
                userId: req.body.userId,
            })
            
            await comment.save()
            // liên kết vs trang bình luận
            post.comments.push(comment)
            await post.save()
            res.status(200).json({ 
                comment: mongooseToOject(comment),
                layout: 'admin'
            })
        }catch(error){
            res.status(500).json(error)
        }
    }
}
module.exports = new PostController