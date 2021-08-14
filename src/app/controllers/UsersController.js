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
const favourites_model = require('../models/Favourite')
const bcrypt = require('bcrypt')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const handleErrors = (err) => {
    let errors = { password: '', passwordNew: ''}
    // sai tài khoản hoặc mật khẩu
    if(err.message === 'Sai mật khẩu') {
        errors.password = 'Sai mật khẩu'
    }
    if(err.message === 'Vui lòng nhập thông tin'){
        errors.message = 'Vui lòng nhập thông tin'
    }
    if(err.message === 'Mật khẩu mới ít nhất có 8 ký tự'){
        errors.passwordNew = 'Mật khẩu mới ít nhất có 8 ký tự'
    }
    // validation erros
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}

class UsersController{
    // [GET] /news
    async index(req,res,next){

        const count = await manga_model.countDocuments()
        var rand = function(min, max){
            // console.log(Math.floor( Math.random() * count ))
            return Math.floor(Math.random() * (max - min)) + min
        }
        Promise.all([
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
            ]),
            manga_model.findOne()
            .skip( rand(( count, count/6)))
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
            ]),
            manga_model.findOne()
            .skip( rand( (count/6), (count/6)*2))
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
            ]),
            manga_model.findOne()
            .skip( rand( (count/6)*2, (count/6)*3))
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
            ]),
            manga_model.findOne()
            .skip( rand( (count/6)*3, (count/6)*4))
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
            ]),
            manga_model.findOne()
            .skip( rand( (count/6)*4, (count/6)*5))
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
            
        ])
        .then(([mangas ,heroLeftTop, heroLeftBottom , herocenter, heroRightTop, heroRightBottom]) => {
            // res.json(mangas)
            res.render('home', {
                layout: 'user.hbs',
                heroLeftTop: mongooseToOject(heroLeftTop),
                heroLeftBottom: mongooseToOject(heroLeftBottom),
                heroCenter: mongooseToOject(herocenter),
                heroRightTop: mongooseToOject(heroRightTop),
                heroRightBottom: mongooseToOject(heroRightBottom),
                mangas: multipleMongooseToOject(mangas),
            })
        })
        .catch(next)
    }

    async detailManga(req, res, next){   
        Promise.all([
            manga_model.findOne({ slug: req.params.slug }).populate('categories').populate('idDetailManga'),
            detailManga_model.findOne({ slug: req.params.slug })
            .populate({
                path:"imgDetails",
                options: { sort: { createAt: -1 } },
                
            })
            .populate({ 
                path: "idFavourite"
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
                // res.json(detailManga)
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
                const cart = user.cart
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
            let cartUser = req.user.cart.items
            const items = req.body.items
            const detailCart = new DetailsCart_Model({
                //numberRental: req.body.numberRental,
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
                    .then((book) => {
                        book_model.updateOne({_id: detailCart.listRentalBooks.items[i].bookId}, {
                            amount: (book.amount - soluongthue)
                        })
                        .then(() => console.log('update số lượng sách thành công!'))
                        .catch(next)
                    })
                    
                })
                detailCart.save()
                cart_model.updateOne(
                    {
                        _id: cart._id
                    }, 
                    {
                        idDetailCart: detailCart._id,
                    },
                )
                .then(() => console.log("update thành công"))
                .catch(next)
                const findUser = user_model.updateOne({
                    _id: req.user._id
                },{
                    $push: {
                        idCart: cart._id
                    },
                    cart: {
                        totalItem: 0,
                        items: [],
                        totalPrice: 0,
                    }
                })
                .then(() => res.json({messge: 'Tạo đơn hàng thành công'}))
                .catch(next)
            })
        })
        .catch(next)
    }

    increaseProductCarts(req, res, next){
        req.user.amountPlus(req.params.id)
            .then((user) =>{
                const cart = user.cart
                res.json(cart)
            })
            .catch( err => console.error(err))
    }

    decreaseProductCarts(req, res, next){
        req.user.amountMinus(req.params.id)
            .then((user) =>{
                const cart = user.cart
                res.json(cart)
            })
            .catch( err => console.error(err))
    }

    userAccount(req, res, next){
        user_model.findOne({_id: req.user.id})
        .then((user) => {
            res.render('users/account', {
                user: mongooseToOject(user)
            })
        })
    }

    async userAccountUpdate(req,res,next){
        const file = req.file
        if(file){
            user_model.updateOne({_id: req.user.id}, {
                avatar: file.filename
            })
            .then(() => {
                console.log('update avatar thành công')
            })
        }
        await user_model.updateOne({_id: req.user.id}, {
            name: req.body.name,
            gender: req.body.gender
        })
        .then(() => {
            console.log('thanh cong')
            res.redirect('/')
        })
        .catch(next)
    }

    viewRentalsHistory(req, res, next){
        user_model.findOne({_id: req.user._id}).populate('idCart')
        .then((user)=>{
            res.render('users/rentalsHistory',{
                user: mongooseToOject(user)
            })
        })
    }

    detailRentalsHistory(req, res, next){
        cart_model.findOne({_id: req.params.id})
        .populate({
            path: 'idDetailCart',
            populate:{
                path: 'listRentalBooks.items.bookId'
            }
        })
            .then((cart) => { 
                //res.json(cart)
                res.render('users/detailRentals', {
                    cart: mongooseToOject(cart),
                })
            })
            .catch(next)
    }
    
    formChangePassword(req, res, next){
        res.render('users/formChangePass')
    }

    async ChangePassword(req, res, next){
        let flag = 0
        await req.user.changePassword(req.user.email, req.body.password, req.body.passwordNew, req.body.passwordNewAgain)
        .then((a) => {     
            console.log(a)
            flag = 1
        })
        .catch((err)=>{
            const errors = handleErrors(err)
            res.status(400).json({errors})
        })
        if(flag == 1){
            const salt = await bcrypt.genSalt()
            const password  = await bcrypt.hash(req.body.passwordNew, salt)
            user_model.updateOne(
                {
                    _id: req.user._id
                }, 
                {
                    password: password
                }
            )
            .then((a) => {
                console.log("thành công",a)
                res.status(200).json({message: "true"})
            })
            .catch((err)=>{
                const errors = handleErrors(err)
                res.status(400).json({errors})
            })
        }

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
    // follow Manga
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
    async favourite(req, res, next){
        const isCheck = await favourites_model.findOne({idManga: req.params.idManga})
        if(isCheck != null){
            const isExist = favourites_model.findOne({arrIdUser: {$in: req.body.idUser} })
            .then((isExist) => {
                if(isExist == null){
                    isCheck.arrIdUser.push(req.body.idUser)
                    isCheck.save()
                    res.status(200).json({
                        favourite: isCheck,
                        message: "true",
                    })
                }else{
                    res.status(200).json({message: "false"})
                }
            })
            .catch(err => console.error(err))
        }else{
            const newfavourite = new favourites_model({
                idManga: req.params.idManga
            })
            console.log("else: ", newfavourite)
            newfavourite.arrIdUser.push(req.body.idUser)
            await newfavourite.save()
            const detailManga = await detailManga_model.updateOne(
                {
                    idManga: req.params.idManga
                },
                {
                    idFavourite: newfavourite._id
                }
            )
            res.status(200).json({message: "true"})
        }
    }
}

module.exports = new UsersController