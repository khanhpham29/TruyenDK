const manga_model = require('../models/Manga')
const detailManga_model = require('../models/DetailManga')
const imageDetail_model = require('../models/ImageDetail')
const rental_model = require('../models/MangaRental')
const category_model = require('../models/CategoryManga')
const book_model = require('../models/book')
const user_model = require('../models/User')
const cart_model = require('../models/Cart')
const post_model = require('../models/post')
const comment_model = require('../models/comment')
const DetailsCart_Model = require('../models/DetailCart')
const follow_model = require('../models/FollowManga')
const notifies_model = require('../models/Notifies')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
class UsersController{
    // [GET] /news
    index(req,res,next){
        manga_model.find({})
        .populate([
            {
                path:'idDetailManga',
                populate:{ 
                    path:'imgDetails',
                    model:'ImgDetail',
                    match: {new: true}
                }
            },{
                path:'categories'
            }
        ])
            .then((mangas) => {
                // res.json(mangas)
                res.render('home', {
                    mangas: multipleMongooseToOject(mangas),
                    layout: 'user.hbs'
                })
            })
            .catch(next)
    }
    async detailManga(req, res, next){
        
        Promise.all([
            manga_model.findOne({ slug: req.params.slug }).populate('category').populate('idDetailManga'),
            detailManga_model.findOne({ slug: req.params.slug }).populate({
                path:"imgDetails",
                options: { sort: { createAt: -1 } }
            }),
        ])
        .then(async ([manga, detailManga]) => {
            const user = req.user
            if(user)
            {
                const checkFollow = await follow_model.findOne({
                    idUser: req.user._id,
                    idManga: {$in: manga._id}
                })
                res.render('users/detailManga', {
                    manga: mongooseToOject(manga),
                    detail: mongooseToOject(detailManga),
                    checkFollow: mongooseToOject(checkFollow),
                    layout: 'user.hbs'
                })
            }else{
                res.render('users/detailManga', {
                    manga: mongooseToOject(manga),
                    detail: mongooseToOject(detailManga),
                    layout: 'user.hbs'
                })
            }
        })
        .catch(next)
    }
    async readManga(req, res, next){
        const manga =  manga_model.findOne({slug: req.params.slug})
        Promise.all([
            imageDetail_model.findOne({ 
                slug: req.params.slug,
                chapter: req.params.chap
            }),
            manga,
            manga
            .populate({
                path:"idDetailManga",
                populate:{
                    path:"idPost",
                    populate:{
                        path:"comments",
                        options: { sort: { createdAt: -1 } },
                        populate:[{
                            path:"idUser",
                            model: "user",
                        },{
                            path: "replies",
                            model: "comment",
                            options: { sort: { createdAt: -1 } },
                            populate:{
                                path:"idUser",
                                model: "user",
                            },
                        }]
                    }
                }
            }),
        ])
        .then(([chapter, manga, mangaforPost])=>{
            // res.json(mangaforPost)
            const comments = comment_model.find({postId: manga.idPost})
            .then((comments)=>{
                res.render('users/chapter',{
                    chapter: mongooseToOject(chapter),
                    manga: mongooseToOject(manga),
                    mangaforPost: mongooseToOject(mangaforPost),
                    comments: multipleMongooseToOject(comments),
                    user: req.user,
                }) 
            })
        })
        .catch(next)
    }
    async rentalOfManga(req, res, next){
        const rentals = await rental_model.find({}).populate('books')

        .then((rentals)=>{
            res.render("users/listRental",{
                rentals: multipleMongooseToOject(rentals)
            })
        })
        .catch(next)
    }
    async categoryOfManga(req, res, next){
        const categorys = await category_model.find()
        .then((categorys)=>{
            res.render("users/listCategory",{
                categorys: multipleMongooseToOject(categorys)
            })
        })
        .catch(next)
    }
    async addToCart(req, res, next){
        req.user.addToCart(req.params.id)
        .then(() =>{
            const user = req.user
            res.json({
                message:"Thêm vào giỏ hàng thành công",
                user
            })
        }).catch( err => console.error(err))
    }
    async getCart(req, res, next){
        req.user
            .populate('cart.items.bookId')
            .execPopulate()
            .then(user =>{
                // res.json(user)
                const cart = user.cart
                // res.json(cart)
                res.render("users/cart",{
                    cart: cart
                })
            })
            .catch( err => console.error(err))
    }
    async deleteItemInCart ( req, res, next){
        req.user.removeInCart(req.params.id)
            .then(() =>{
                res.json(req.user)
                // res.redirect('/cart')
            })
            .catch( err => console.error(err))
    }


    async userRentals(req, res, next){
        const cart = new cart_model({
            phone: req.user.phone,
            totalPrice: req.body.totalPrice
        })
        cart.save()
        .then((cart) =>{
            const cartUser = req.user.cart.items
            const detailCart = new DetailsCart_Model({
                numberRental: req.body.numberRental,
                idCart: cart._id,
                totalItem: req.user.cart.totalItem,
                totalPrice: req.user.cart.totalPrice,
            })
            detailCart.save()
            .then((detailCart)=>{  
                cartUser.forEach((item, i) =>{
                    detailCart.listRentalBooks.items.push({bookId: item.bookId, amount: item.amount})
                    const soluongthue =  detailCart.listRentalBooks.items[i].amount
                    book_model.findOne({_id: detailCart.listRentalBooks.items[i].bookId})
                        .then((books) => {
                            book_model.updateOne({_id: detailCart.listRentalBooks.items[i].bookId}, {
                                amount: (books.amount - soluongthue)
                            })
                        })
                        .catch(err => console.log(err))
                })
                detailCart.save()
                cart_model.updateOne(
                    {
                        _id: cart._id
                    }, 
                    {
                        idDetailCart: detailCart._id,
                        $push: { 
                            arrayStatus: 'Chưa xác thực'
                        }
                    },
                )
                .then(() => console.log("update thành công"))
                .catch(next)
                const userCart =user_model.updateOne({phone: cart.phone},{
                    cart:{
                        totalItem: 0,
                        items: [],
                        totalPrice: 0,
                    }
                })
                .then(() => {
                    console.log("thanh cong")
                })
                
                .catch(err => console.log(err))
                // console.log(cart)
                res.redirect("/")
            })
        })
        .catch(next)
    }
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
            .then((newComment) =>{
                res.status(200).json({ 
                    comment: mongooseToOject(newComment),
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
            .then((replyComment)=>{
                res.status(200).json({ 
                    replyComment: mongooseToOject(replyComment),
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
    async followManga(req, res, next){
        const data = req.body
        const isExist = await follow_model.findOne({idUser: data.idUser})
        if(!isExist){
            const newFollow = new follow_model({
                idUser: data.idUser,
            })
            newFollow.idManga.push(req.params.idManga)
            await newFollow.save()
            detailManga_model.findOne({idManga: req.params.idManga})
            .then((result,err)=>{
                // console.log(result)
                result.arrIdFollow.push(newFollow._id)
                result.save()
            })
            res.json({message: "Đã thêm vào theo dõi truyện"})
        }
        else{
            isExist.idManga.push(req.params.idManga)
            isExist.save()
            detailManga_model.findOne({idManga: req.params.idManga})
            .then((result,err)=>{
                result.arrIdFollow.push(isExist._id)
                result.save()
            })
            res.status(200).json({message: "Đã thêm vào theo dõi truyện"})
        }
    }
    async cancelFollow(req, res, next){
        const data = req.body
        const isExist = await follow_model.findOne({idUser: data.idUser})
        .then(async (isExist)=>{
            isExist.idManga.forEach((id, index) => {
                if (id == req.params.idManga) {
                    isExist.idManga.splice(index, 1);
                    return true;
                }
            })
            const afterDelete = await follow_model.updateOne({
                _id: isExist._id,
            },{
                idManga: isExist.idManga
            })
            const detailManga = await detailManga_model.findOne({idManga: req.params.idManga})
            detailManga.arrIdFollow.pull(isExist._id)
            detailManga.save()
            res.status(200).json("Đã hủy theo dõi truyện")
        })
        .catch((err)=>{
            res.json(err)
        })
    }
    listFollow(req, res, next){
        const user = req.user
        if(user){
            const listFollow = follow_model.findOne({idUser: user._id})
            .populate({
                path: 'idManga',
                populate:{
                    path: 'idDetailManga',
                    populate:{
                        path:'imgDetails',
                        match: {new: true}
                    }
                }
            })
            .then((listFollow) => {
                // res.json(listFollow)
                res.render("users/listFollowManga",{
                    listFollow: mongooseToOject(listFollow)
                })
            })
        }else{
            res.render("users/listFollowManga",{
                message: "false"
            })
        }
    }
    async getNotifies(req, res, next){
        const user = req.user
        if(user){
            Promise.all([
                follow_model.findOne({idUser: user._id}),
                notifies_model.find(
                    {idUser: {$in: user._id}},
                )
                .populate({
                    path:"idChapter"
                })
                .populate({
                    path:"idManga"
                })
                .limit(20).sort( { createdAt: -1 } )
            ])
            .then(([listFollow, notification])=>{
                res.json({
                    notification: multipleMongooseToOject(notification),
                    listFollow: mongooseToOject(listFollow)
                })
            })
        }
        
    }
}

module.exports = new UsersController