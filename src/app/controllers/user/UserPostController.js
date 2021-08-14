const manga_model = require('../../models/Manga')
const detailManga_model = require('../../models/DetailManga')
const imageDetail_model = require('../../models/ImageDetail')
const rental_model = require('../../models/MangaRental')
const category_model = require('../../models/CategoryManga')
const book_model = require('../../models/book')
const user_model = require('../../models/User')
const cart_model = require('../../models/Cart')
const post_model = require('../../models/post')
const comment_model = require('../../models/comment')
const DetailsCart_Model = require('../../models/DetailCart')
const follow_model = require('../../models/FollowManga')
const notifies_model = require('../../models/Notifies')
const favourites_model = require('../../models/Favourite')
const bcrypt = require('bcrypt')
const { multipleMongooseToOject } = require('../../../util/mongoose')
const { mongooseToOject } = require('../../../util/mongoose')

class UserPostController{
    // comments
    async postsComment(req, res, next){
        try{
            const post = await post_model.findById(req.params.idPost)
            // create a comment
            const comment = new comment_model({
                idPost: post._id,
                content: req.body.content,
                idUser: req.body.idUser,
            })
            await comment.save()
            // liên kết vs trang bình luận
            post.comments.push(comment)
            await post.save()
            const newComment = comment_model.findById(comment._id).populate("idUser")
            .then(async (newComment) =>{
                const postGetComments = await post_model.findById(post._id).populate("comments")
                var totalCmt = postGetComments.comments.length
                postGetComments.comments.forEach((el) => {
                    totalCmt += el.replies.length
                })
                res.status(200).json({ 
                    comment: mongooseToOject(newComment),
                    totalCmt 
                })
            })
        }catch(error){
            res.status(500).json(error)
        }
    }
    // reply comments
    async replyComment(req, res, next){
        const comment = await comment_model.findOne({_id: req.params.idComment})
        .then(async (comment)=>{
            const newComment = new comment_model({
                idComment: comment._id,
                idPost: req.body.idPost,
                content: req.body.content,
                idUser: req.body.idUser,
            })
            await newComment.save()
            comment.replies.push(newComment)
            await comment.save()
            const replyComment = await comment_model.findOne({_id: newComment._id}).populate({
                path:"idUser",
                model: "user"
            })
            .then( async (replyComment)=>{
                const post = await post_model.findById(comment.idPost).populate("comments")
                var totalCmt = post.comments.length
                post.comments.forEach((el) => {
                    totalCmt += el.replies.length
                })
                res.status(200).json({ 
                    replyComment: mongooseToOject(replyComment),
                    totalCmt
                })
            })
            .catch((err)=>{
                res.json(err)
            })
        })
        .catch((err)=>{
            res.json(err)
        })
    }

    // like commnets
    async likeComment(req, res, next){
        const checkLike = await comment_model.find(
            { 
                $and: [
                    {
                        _id: req.body.idComment
                    },
                    {
                        likes: {$in: req.params.idUser }
                    }
                ]
            },
        )
        .then(async (checkLike)=>{
            if(isEmpty(checkLike)){
                const comment = await comment_model.updateOne(
                    {
                        _id: req.body.idComment
                    },
                    {
                        $push: {likes: req.params.idUser}
                    }
                )
                .then(async (comment)=>{
                    const cmt = await comment_model.findById(req.body.idComment)
                    res.status(200).json({
                        comment: mongooseToOject(cmt),
                        message: "true",
                    })
                })
                .catch((err)=>{
                    res.status(400).json({message: err.message})
                })
            }else{
                const comment = await comment_model.updateOne(
                    {
                        _id: req.body.idComment
                    },
                    {
                        $pull: {likes: req.params.idUser}
                    }
                )
                .then(async (comment)=>{
                    const cmt = await comment_model.findById(req.body.idComment)
                    res.status(200).json({
                        comment: mongooseToOject(cmt),
                        message: "true",
                    })
                })
                .catch((err)=>{
                    res.status(400).json({message: err.message})
                })
            }
        })
        .catch(next)
    }
}
module.exports = new UserPostController