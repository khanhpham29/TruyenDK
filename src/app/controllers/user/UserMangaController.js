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
const history_model = require('../../models/History')
const notifies_model = require('../../models/Notifies')
const favourites_model = require('../../models/Favourite')
const bcrypt = require('bcrypt')
const { multipleMongooseToOject } = require('../../../util/mongoose')
const { mongooseToOject } = require('../../../util/mongoose')

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
        .then(async ([chapter, manga, mangaforPost])=>{
            // res.json(mangaforPost)
            const detailManga = await detailManga_model.findById(manga.idDetailManga)
            const comments = comment_model.find({idPost: detailManga.idPost})
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

    async categoryOfManga(req, res, next){
        const categorys = await category_model.find()
        .then((categorys)=>{
            res.render("users/listCategory",{
                categorys: multipleMongooseToOject(categorys)
            })
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
    async history(req, res, next){
        const user = req.user
        if(user){
            const histories = await history_model.findOne({idUser: user._id}) 
            .populate({
                path: 'arrMangaId.idManga',
                populate:{
                    path: 'idDetailManga',
                    populate:{
                        path:'imgDetails',
                        match: {
                            chapter: 'arrMangaId.chapter'
                        }
                    }
                }
            })
            .limit(20)
            .then((histories) => {
                // res.json(histories)
                res.render("users/histories",{
                    histories: mongooseToOject(histories)
                })
            })
        }else{
            res.render("users/histories",{
                message: "false"
            })
        }
    }
    async postHistory(req, res, next){
        const data = await req.body
        const imageDetail = await imageDetail_model.findById(data.idChapter)
        const manga = await manga_model.findById(req.params.idManga).populate('categories')
        const isExistHistory = await history_model.findOne(
            {
                idUser: data.idUser,
            }
        )
        if(isExistHistory){
            
            const isExistInArr = await history_model.findOne(
                {
                    idUser: data.idUser,
                    arrMangaId: {
                        $elemMatch: {nameManga:  manga.nameManga}
                    }
                }
            )
            if(isExistInArr){
                history_model.updateOne(
                    {
                        idUser: data.idUser,
                        arrMangaId: {
                            $elemMatch: {nameManga:  manga.nameManga}
                        }
                    },
                    {
                        $set: { 'arrMangaId.$.chapter' : imageDetail.chapter} 
                    },
                    (err,data)=>{
                        console.log(data)
                    }
                )
            }
            else{
                var arrCate = []
                manga.categories.forEach((category)=>{
                    arrCate.push(category.nameCategory)
                })
                history_model.updateOne(
                    {
                        _id: isExistHistory._id,
                    },
                    {
                        $push: 
                        {
                            arrMangaId:
                            {
                                nameManga: manga.nameManga,
                                otherName: manga.otherName,
                                categories: arrCate,
                                image:manga.image,
                                slug: manga.slug,
                                chapter: imageDetail.chapter,
                            } 
                        }
                    },
                    function(err, result) {
                        console.log("result", result);
                    }
                )
            }
            
        }else{
            var arrCate = []
            manga.categories.forEach((category)=>{
                arrCate.push(category.nameCategory)
            })
            const newHistory = new history_model({
                idUser: data.idUser,
            })
            await newHistory.save()
            history_model.updateOne(
                {
                    _id: newHistory.id,
                },
                {
                    $push: 
                    {
                        arrMangaId:
                        {
                            nameManga: manga.nameManga,
                            otherName: manga.otherName,
                            categories: arrCate,
                            image:manga.image,
                            slug: manga.slug,
                            chapter: imageDetail.chapter
                        } 
                    }
                },
                function(err, result) {
                    console.log("new history",result)
                }
            )
            res.status(200).json({message:"true"})
        }
    }
}

module.exports = new UsersController