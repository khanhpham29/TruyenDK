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


const handleErrors = (err) => {
    let errors = { category: ''}
    // duplicate error code-point
    if( err.code === 11000){
        errors.category = 'Thể loại này đã tồn tại'
        return errors
    }
    console.log(err.message)
    // validation erros
    if(err.message.includes('categories validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    
    return errors
}

class AdminController{
    // [GET] /manga
    // Hiển thị tất cả manga trong db
    async manga(req, res, next){
        const mangas = await Manga.find({})
        .populate('categories')
        .populate('idDetailManga')
            .then((mangas) => {
                res.render('admins/mangas/mangaList', {
                    mangas: multipleMongooseToOject(mangas),
                    layout: 'admin.hbs'
                })
            })
            .catch(next)   
    }
    //[GET] /manga/add
    formMangaCreate(req, res, next){
        categoies_model.find({})
            .then(categories => {
                res.render('admins/mangas/mangaCreate', 
                    { categories:  multipleMongooseToOject(categories),
                        layout: 'admin.hbs'
                    }
                )
            })
            .catch(err => res.json(err))    
    }
    
    //Thêm manga
    //[POST] /manga/add
    async mangaCreate(req, res, next){
        const data =  req.body
        const mangaNew =  new Manga({
            nameManga: data.nameManga,
            otherName: data.nameManga2,
            categories: data.category,
            image: req.file.filename,
        })
        await mangaNew.save()
        
        const detailManga = new detailmanga_model({
            idManga: mangaNew._id,
            nameManga: mangaNew.nameManga,
            description: data.description,
        })
        await detailManga.save()
        // liên kết vs chi tiết
        Manga.updateOne({_id: mangaNew._id},{
            idDetailManga: detailManga._id
        })
        .then(()=>{
            res.status(200).json({message:"Thêm thành công"})
        })
        .catch(next)
    }

    //form edit manga
    //[GET] /manga/edit
    formMangaEdit(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}).populate('categories'), 
            categoies_model.find({}),
        ])
        .then(([mangas, categories]) => {
                res.render('admins/mangas/mangaEdit', { 
                    mangas: mongooseToOject(mangas),
                    categories:  multipleMongooseToOject(categories),
                    layout: 'admin.hbs'
                })
            })
        .catch(next)
    }   
    //form edit manga
    //[POST] /manga/edit
    async mangaEdit(req, res, next){
        if(req.file == null)
        {
            Manga.updateOne({ slug: req.params.slug }, {
                nameManga: req.body.nameManga,
                status: req.body.tinhtrang,
                categories: req.body.category,
            })
            detailmanga_model.updateOne({slug: req.params.slug},{
                status: req.body.tinhtrang,
            })
            .then(() => res.json({
                message: "Sửa thành công"
            }))
            .catch(next) 
        }
        else{
            Manga.updateOne({ slug: req.params.slug }, {
                nameManga: req.body.nameManga,
                categories: req.body.category,
                image: req.file.filename,
            })
            detailmanga_model.updateOne({slug: req.params.slug},{
                status: req.body.tinhtrang,
            })
            .then(() => res.json({
                message: "Sửa thành công"
            }))
            .catch(next) 
        }
        
    }
    
    // [GET] /manga/:slug
    //Thông tin chi tiết của 1 manga
    infoManga(req, res, next){
        const sort = { createAt: -1}
        Promise.all([
            Manga.findOne({ slug: req.params.slug }).populate('categories').populate('idDetailManga'),
            detailmanga_model.findOne({ slug: req.params.slug }),
            ImageDetail.find({ slug: req.params.slug}).sort(sort)
        ])
            .then(([manga, detail, chapters]) => {
                // res.json(manga)
                res.render('admins/mangas/mangaDetail', {
                    manga: mongooseToOject(manga),
                    detail: mongooseToOject(detail),
                    chapters: multipleMongooseToOject(chapters),
                    layout: 'admin.hbs'
                })
            })
            .catch(next)
    }

    //hiển thị danh sách img trong chap
    //----------------------
    // [GET]/manga/:tentruyen/:chapter
    readChap(req, res, next){
        Promise.all([
            detailmanga_model.findOne({tentruyen: req.params.tentruyen}),
                //.populate('ImgDetail'), 
                ImageDetail.find({chapter: req.params.chapter})
        ])            
            .then(([name, chap]) => {
                if(name == null){
                    return res.render('null')
                }
                else if(chap == null){
                    return res.render('null')
                }
                else if(name != null && chap != null){
                    for(var i = 0; i < chap.length;i++){                   
                        for(var j =0;j<name.ImgDetail.length;j++){
                            console.log(i +' - '+ j +' : '+chap[i]._id + ' - ' + name.ImgDetail[j])
                            if(chap[i]._id.toString() === name.ImgDetail[j].toString()){
                                return res.render('admins/mangas/details-manga-img', {chapImg: chap[i], layout: 'admin.hbs'}
                                )
                            }
                        }
                    }
                    return res.render('null')    
                }
            })
            .catch(err => {res.json(err)})
    }   

    //Mở form thêm chap mới vào truyện
    //[GET] /manga/:tentruyen/addChap
    async createChapterManga(req,res,next){
        Promise.all([
            Manga.findOne({ slug: req.params.slug }),
            ImageDetail.findOne({ slug: req.params.slug }).sort({chapter:-1})  
        ])

        .then(([manga, chapter]) => {
            // res.json(chapter)
            res.render('admins/mangas/mangaCreateChapter', 
            {
                manga: mongooseToOject(manga),
                chapter: mongooseToOject(chapter),
                layout: 'admin.hbs'
            })
        })
        .catch(next)
    }
    //Thêm chap mới vào truyện
    //[POST] /manga/:tentruyen/addChap
    //
    async createChapter(req, res, next){
        const files = req.files
        if(files.length < 1){
            res.status(400).json({ messageFile:'Vui lòng chọn file' })
        }
        else{
            let filesArr = []
            files.forEach(element => {
                const file = {
                    fileName: element.filename,
                    fileType: element.mimetype,
                    filePath: element.path.split('\\').slice(2).join('\\'),
                }
                filesArr.push(file)
            })
            var chapterExist = false
            const detailManga = await detailmanga_model.findOne({
                slug: req.params.slug
            }).populate("imgDetails")
            .then( async (detailManga)=>{
                detailManga.imgDetails.forEach((el)=>{
                    if(el.chapter == req.body.chapter){
                        chapterExist = true
                    }
                })
                if(chapterExist == false){
                    const checkNew = detailManga.imgDetails.length
                    if(checkNew > 0){
                        ImageDetail.findOne({
                            slug: req.params.slug,
                            new: true 
                        },
                        function(err, result){
                            result.new = "false"
                            result.save()
                        })
                    }
                    const imgChapManga =  new ImageDetail({
                        imgManga: filesArr,
                        chapter: req.body.chapter,
                        idDetail: detailManga._id,
                        nameManga: detailManga.nameManga
                    })
                    imgChapManga.save()
                    detailManga.imgDetails.push(imgChapManga)
                    await detailManga.save()
                    const usersFollow = await follow_model.find({idManga: {$in: detailManga.idManga}})
                    var listUserId = []
                    usersFollow.forEach((el)=>{
                        listUserId.push(el.idUser)
                    })
                    const newNotification =  new notifies_model({
                        idChapter: imgChapManga._id,
                        idManga: detailManga.idManga,
                        idUser: listUserId
                    })
                    await newNotification.save()
                    const notification = notifies_model.findById(newNotification._id)
                    .populate({
                        path:"idChapter"
                    })
                    .populate({
                        path:"idManga"
                    })
                    .then((notification) => {
                        res.json({
                            message: "Thêm chương thành công",
                            notification: mongooseToOject(notification),
                        })
                    })
                    .catch(err =>{
                        res.json(err)
                    })
                }else{
                    res.status(400).json({messageChapter: "Chương này đã tồn tại"})
                }
            })
        }
    }
    async searchManga(req, res, next){
    const mangas = await Manga.find({})
        .then((mangas) => {
            res.json({
                mangas: multipleMongooseToOject(mangas),
            })
        })
        .catch(next)    
    }

    //--------------USER--------------------//
    async listUsers(req, res, next){
        await User_Model.find({role: "member"})
        .then((users) => {
            res.render('admins/users/list-users', {
                users: multipleMongooseToOject(users),
                layout:'admin'
            })
        })
        .catch(next)
    }
    async searchUsers(req, res, next){
        const users = await User_Model.find({})
        .then((users) => {
            res.json({users: multipleMongooseToOject(users)})
        })
        .catch(next)
    }
    
}

module.exports = new AdminController()
