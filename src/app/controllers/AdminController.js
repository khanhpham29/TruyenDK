const Manga = require('../models/Manga')
const DetailManga = require('../models/DetailManga')
const ImageDetail = require('../models/ImageDetail')
const Category = require('../models/CategoryManga')
const MangaRental_model = require('../models/MangaRental')
const User_Model = require('../models/User')
const Cart_Model = require('../models/Cart')
const DetailsCart_Model = require('../models/DetailsCart')
const post_model = require('../models/post')
const comment_model = require('../models/comment')
const book_model = require('../models/book')
const multer = require('multer')
const path = require('path')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const mongoose = require('mongoose')
const { PromiseProvider } = require('mongoose')
const { listeners } = require('../models/Manga')
const MangaRental = require('../models/MangaRental')



const handleErrors = (err) => {
    let errors = { tenloai: '', tapso: '', tentruyen: ''}
    // duplicate error code-point
    if( err.code === 11000){
        errors.tenloai = 'Thể loại này đã tồn tại'
        errors.tentruyen = 'Truyện này đã tồn tại'
        return errors
    }
    // validation erros
    if(err.message.includes('categorys validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    if(err.message.includes('mangas validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    
    return errors
}

class AdminController{
    // [GET] /manga
    // Hiển thị tất cả manga trong db
    manga(req, res, next){
        // console.log('User: ',req.user)
        Manga.find({}).populate('category')
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
        Category.find({})
            .then(categories => {
                res.render('admins/mangas/mangaCreate', { 
                        categories:  multipleMongooseToOject(categories),
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
            category: data.category,
            image: req.file.filename,
        })
        await mangaNew.save()
        const detailManga = new DetailManga({
            nameManga: mangaNew.nameManga,
            description: data.description,
        })
        await detailManga.save()
        res.json({message:"Thêm thành công"})
    }

    //form edit manga
    //[GET] /manga/edit
    formMangaEdit(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}).populate('category'), 
            Category.find({}),
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
        Manga.updateOne({ slug: req.params.slug }, {
            nameManga: req.body.nameManga,
            status: req.body.tinhtrang,
            category: req.body.category,
            description: req.body.description,
            image: req.file.filename,
        })
        .then(() => res.json({
            message: "Sửa thành công"
        }))
        .catch(next) 
    }
    
    // [GET] /manga/:slug
    //Thông tin chi tiết của 1 manga
    infoManga(req, res, next){
        Promise.all([
            Manga.findOne({ slug: req.params.slug }),
            DetailManga.find({ slug: req.params.slug })
        ])
            .then(([truyen, chap]) => {
                if(truyen == null){
                    return res.render('null')                   
                }
                else{
                    res.render('admins/mangas/details-manga', {
                        truyen: mongooseToOject(truyen),
                        chap: multipleMongooseToOject(chap),
                        layout: 'admin.hbs'
                    })
                }
                
            })
            .catch(next)
    }

    //hiển thị danh sách img trong chap
    //----------------------
    // [GET]/manga/:tentruyen/:chapter
    readChap(req, res, next){
        Promise.all([
            DetailManga.findOne({tentruyen: req.params.tentruyen}),
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
        const manga = await Manga.findOne({ slug: req.params.slug })
        .then(manga => {
            res.render('admins/mangas/mangaCreateChapter', 
            {
                manga: mongooseToOject(manga), 
                layout: 'admin.hbs'
            })
        })
        .catch(next)
    }
    
    //Thêm chap mới vào truyện
    //[POST] /manga/:tentruyen/addChap
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
            });
            const detailExist = await DetailManga.findOne({
                slug: req.params.slug
            })
            .then((detailExist)=>{
                const checkChapter = ImageDetail.findOne({
                    slug: req.params.slug,
                    chapter: req.body.chapter
                })
                if(checkChapter != null){
                    const checkNew = detailExist.imgDetails.length
                    if(checkNew > 0){
                        ImageDetail.findOne(
                            {  new: true },
                            function(err, result){
                                if(err){
                                    console.log(err)
                                }else{
                                    if(!result){
                                        res.status(400).send()
                                    }else{
                                        result.new = "false"
                                        result.save()
                                    }
                                }
                            }
                        )
                    }
                    const imgChapManga =  new ImageDetail({
                        imgManga: filesArr,
                        chapter: req.body.chapter,
                        idDetail: detailExist._id,
                        nameManga: detailExist.nameManga
                    })
                    imgChapManga.save()
                    detailExist.imgDetails.push(imgChapManga)
                    detailExist.save()
                    .then(() => res.json({message: "Thêm thành công"}))
                    .catch(err =>{
                        res.json(err)
                    })
                }else{
                    res.status(400).json({messageChapter: "Chương này đã tồn tại"})
                }
            })
        }
    }
    
    //search with tentruyen or tenkhac
    async search(req, res, next){
        const value = req.query.tentruyen
        await Manga.find({
            $or:[
                {tentruyen: {$regex: new RegExp(value , "i")}},
                {tenkhac: {$regex: new RegExp(value , "i")}}
            ]
        }
        )
        .then((mangas) => res.render('admins/mangas/results-search-manga', {
            mangas: multipleMongooseToOject(mangas),
            layout: 'admin'
        }))
        .catch(next)
    }
    //---------------------------------------------------------------------------//
    //MangaRental
    async mangaRentals(req, res, next){
        const Rental = await MangaRental_model.find({})
        .then((Rental) => {
            res.render('admins/mangas/rentalList', {
                rentals: multipleMongooseToOject(Rental),
                layout: 'admin.hbs'
            })
        })
    }
    async listMangaRentals(req, res, next){
        const list = await book_model.find({tentruyen: req.params.tentruyen})
        .then((list)=>{
            res.render("admins/mangas/mangaRentalList",{
                list: multipleMongooseToOject(list),
                layout: 'admin.hbs'
            })
        })
        .catch((err) => {
            res.status(400).json({err})
        })
    }
    // form MangaRental
    formCreateMangaRental(req, res, next){
        Manga.find({}).populate('theloai')
        .then((mangas) => {
            res.render('admins/mangas/rentalCreate', { 
                mangas:  multipleMongooseToOject(mangas),
                layout: 'admin.hbs'
            })
        })
        .catch(err => res.json(err))
    }
    async createMangaRental(req, res, next){
        const formdata = req.body
        Promise.all([
            Manga.findOne({_id: formdata.id}), 
            MangaRental_model.findOne({_id: formdata.id}),
        ])
        .then(async ([mangas , rentals])=>{
            if(rentals == null){
                const Rental =  new MangaRental_model({
                    nameManga: mangas.nameManga
                })
                rentals = Rental
            }
            const episodeExists = await book_model.findOne({
                nameManga: mangas.nameManga,
                episode: formdata.episode,
            })
            .then(async (episodeExists)=>{
                console.log(episodeExists)
                if(episodeExists != null)
                {
                    res.json({messageError: 'Tập này đã tồn tại'})
                }
                else{
                    let booksNew = {
                        nameManga: mangas.nameManga,
                        episode: formdata.episode,
                        image: req.file.filename,
                        cost: formdata.giagoc,
                        rentCost: formdata.giathue,
                        covercost: formdata.giabia,
                        amount: formdata.amount,
                        author: formdata.author, 
                        publisher: formdata.publisher,
                    }
                    const bookNew = new book_model(booksNew)
                    bookNew.save()
                    rentals.books.push(bookNew._id)
                    await rentals.save()
                    .then((rentals)=>{
                        res.json({message: "Đã thêm truyện cho thuê thành công"})
                    })
                    .catch((err)=>{
                        const errors = handleErrors(err)
                        res.status(400).json( { errors })
                    })
                }
            })
            
        })
    }
    //---------------------------------------------------------------------------//
    //Categorys
    //[GET] /admin/categorys
    categorys(req, res, next){
        Promise.all([   Category.find({}).sorttable(req), 
                        Category.countDocumentsDeleted(),
                    ])
            .then(([categorys, deleteCount]) =>{
                res.render('admins/categorys/categoryList',{
                    deleteCount,
                    categorys: multipleMongooseToOject(categorys),
                    layout: 'admin'
                })
            }) 
            .catch(next)
    }
    categoryTrash(req, res, next){
        Category.findDeleted({})
            .then(categorys =>{
                res.render('admins/categorys/categoryTrash',{
                    categorys: multipleMongooseToOject(categorys),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[GET]  /admin/categorys/formCategoryCreate
    formCategoryCreate(req, res, next){
        res.render('admins/categorys/categoryCreate',{
            layout: 'admin.hbs'
        })
    }
    //[POST]
    categoryCreate(req, res, next){
        const data = req.body
        const category = new Category(data)
        category.save()
        .then(()=> res.status(200).json({message: "Thêm thành công"}))
        .catch((err) =>{
            const errors = handleErrors(err)
            res.status(400).json( { errors } )
        })
        
    }
    //[GET] /categorys/:id/categoryEdit
    async categoryEdit(req, res, next){
        const theloai = await Category.findById(req.params.id)
            .then((theloai)=>{
                console.log(theloai)
                res.render('admins/categorys/categoryEdit',{
                    theloai: mongooseToOject(theloai),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[PUT] /categorys/:id
    async categoryUpdate(req, res, next){
        const formdata = req.body
        await Category.updateOne({ _id: req.params.id }, formdata)
            .then(() => res.redirect('../categorys'))
            .catch(next)
    }
    //[DELETE] /categorys/:id
    categoryDelete(req, res, next){
        Category.delete({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[GET] /categorys/categoryTrash
    categoryTrash(req, res, next){
        Category.findDeleted({})
            .then(theloais =>{
                res.render('admins/categorys/categoryTrash',{
                    theloais: multipleMongooseToOject(theloais),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[PATCH] /categorys/:id
    categoryRestore(req, res, next){
        Category.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }

    //[DELETE] /categorys/:id/categoryForceDelete
    categoryForceDelete(req, res, next){
        Category.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[PATCH] /categorys/:id/categoryRestore
    categoryRestore(req, res, next){
        Category.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[POST] /categorys/handle-form-actions
    handleFormActions(req, res, next){
        switch(req.body.action){
            case 'delete':
                Category.delete({ _id: {$in: req.body.categoryIds }})
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;
            case 'restore':
                Category.restore({ _id: {$in: req.body.categoryIds }})
                    .then(() => res.redirect('back'))
                    .catch(next)
                    break
            case 'deleteForce':
                Category.deleteMany({ _id: {$in: req.body.categoryIds }})   
                    .then(() => res.redirect('back'))
                    .catch(next)
                    break
            default:
                res.json(req.body)
        }
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
        const value = req.query.user
        await User_Model.findOne({
            phone: {$regex: new RegExp(value)}
        }
        )
        .then((user) => res.render('admins/users/search-user', {
            user: mongooseToOject(user),
            layout: 'admin.hbs'
        }))
        .catch(next)
    }
    //Posts
    async listPosts(req, res, next){
        try{
            const sort = { createdAt: -1}
            const posts = post_model.find({}).sort(sort)
            .then((posts) =>{
                res.render("posts/listPosts",{
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
        res.render('posts/formPost',{layout: 'admin'})
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
                    post: mongooseToOject(post),
                    layout: 'admin'
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
                comment: mongooseToOject(comment),
                layout: 'admin'
            })
        }catch(error){
            res.status(500).json(error)
        }
    }
}

module.exports = new AdminController()
