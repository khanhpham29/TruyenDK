const Manga = require('../models/Manga')

const DetailManga = require('../models/DetailManga')
const ImageDetail = require('../models/ImageDetail')
const Category = require('../models/CategoryManga')
const RentalForManga = require('../models/RentalForManga')
const User_Model = require('../models/User')
const Cart_Model = require('../models/Cart')
const DetailsCart_Model = require('../models/DetailsCart')
const post_model = require('../models/post')
const comment_model = require('../models/comment')
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const { PromiseProvider } = require('mongoose')

const handleErrors = (err) => {
    let errors = { tenloai: ''}
    // duplicate error code-point
    if( err.code === 11000){
        errors.tenloai = 'Thể loại này đã tồn tại'
        return errors
    }
    // validation erros
    return errors
}



class AdminController{
    index(req,res,next){
        Manga.find({})
            .then(mangas => {
                res.render('mangas/mangaList', {
                    mangas: multipleMongooseToOject(mangas),
                    layout: 'admin.hbs'
                })
            })
            .catch(next)
    const { listeners } = require('../models/Manga')
    }
    //Mở form thêm manga
    //[GET] /manga/add
    formMangaCreate(req, res, next){
        Category.find({})
            .then(categories => {
                res.render('admins/create-manga', 
                    { categories:  multipleMongooseToOject(categories),
                        layout: 'admin.hbs'
                    }
                )
            })
            .catch(err => res.json(err))    
    }

    
    //Thêm manga
    //[POST] /manga/add
    mangaCreate(req, res, next){
        Manga.findOne({tentruyen: req.body.nameManga })
            .then(mangas =>{
                if(mangas == null || mangas.tinhtrang == 'Ngưng'){
                    

                    let cbRental = false
                    if(req.body.cbRental == 'true'){
                        cbRental = true
                        const manga =  new Manga({
                                tentruyen: req.body.nameManga,
                                tenkhac: req.body.nameManga2,
                                theloai: req.body.category,
                                mota: req.body.description,
                                hinh: req.files.avatarManga[0].filename,
                                chothue: req.body.cbRental,                    
                        })
                        manga.save(function(err){
                            if(err){
                                res.json({'errMess':err})
                            }
                            else{
                                const truyenChoThue = new RentalForManga({
                                    idManga: manga._id,
                                    books: [{  
                                        
                                        tentap: req.body.numberVol,
                                        anhbia: req.files.avatarNumberVol[0].filename, 
                                        gia: req.body.price,
                                        soluong: req.body.amount,
                                        tacgia:req.body.author, 
                                        nxb: req.body.publisher,
                                    }]
                                })
                                truyenChoThue.save()
                                
                                .then(() =>
                                    Manga.updateOne({_id: manga._id}, {
                                            $push:{truyenchothue :truyenChoThue.books[0]._id},
                                    }),
                                    
                                    res.redirect('/admin/manga')
                                    )
                                .catch(next)
                            }
                        })
                    }
                    else if(req.body.cbRental != 'true'){
                        const manga = new Manga({
                            tentruyen: req.body.nameManga,
                            tenkhac: req.body.nameManga2,
                            theloai: req.body.category,
                            mota: req.body.description,
                            hinh: req.files.avatarManga[0].filename,                      
                        })
                        manga.save(function(err){
                            if(err){
                                res.json({'errMess':err})
                            }
                            else{
                                return res.redirect('/admin/manga');
                            }
                        })
                    }
                    
                }
                else{
                    res.json('Truyện đã tồn tại, xem lại!!!')
                }
            })
            .catch(next)
    }
    //form edit manga
    //[GET] /manga/edit
    formMangaEdit(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}), 
            Category.find({}),
        ])
            .then(([mangas, categories]) => {
                    res.render('admins/mangas/edit-manga', { 
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
        if(req.body.cbRental != "true"){
            req.body.cbRental = false
        }
        if(!req.file){
            await Manga.updateOne({ slug: req.params.slug }, {
                tentruyen: req.body.nameManga,
                tenkhac: req.body.nameManga2,
                tinhtrang: req.body.cbbStatus,
                theloai: req.body.category,
                mota: req.body.description,
                hinh: req.body.avatarManga2,
                chothue: req.body.cbRental,
            })
            .then(() => res.redirect('/admin/manga'))
            .catch(next)
        }
        else{
            await Manga.updateOne({ slug: req.params.slug }, {
                tentruyen: req.body.nameManga,
                tenkhac: req.body.nameManga2,
                tinhtrang: req.body.cbbStatus,
                theloai: req.body.category,
                mota: req.body.description,
                hinh: req.file.filename,
                chothue: req.body.cbRental,
            })
            .then(() => res.redirect('/admin/manga'))
            .catch(next) 
        }
    }
    // [GET] /manga
    // Hiển thị tất cả manga trong db
    manga(req, res, next){
        // console.log('User: ',req.user)
        Manga.find({})
            .then(mangas => {
                    res.render('admins/mangas/manga-list', {
                        mangas: multipleMongooseToOject(mangas),
                        layout: 'admin.hbs'
                    })    
            })
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
                //res.json(chap)
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
    createChapterManga(req,res,next){
        Manga.findOne({ slug: req.params.slug })
        .then(truyen => {
            res.render('admins/mangas/create-chapter-manga', 
            {
                truyen: mongooseToOject(truyen), 
                layout: 'admin.hbs'
            })
        })
        .catch(next)
    }

    //Thêm chap mới vào truyện
    //[POST] /manga/:tentruyen/addChap
    createChapter(req, res, next){
        const files = req.files
        if(!files){
            res.send('Upload ko thành công')
        }
        else{
            let filesArr = []
            files.forEach(element => {
                const file = {
                    fileName: element.originalname,
                    fileType: element.mimetype,
                    filePath: element.path.split('\\').slice(2).join('\\'),
                }
                filesArr.push(file)
            });
            const imgChapManga = new ImageDetail({
                _id: new mongoose.Types.ObjectId(),
                imgManga: filesArr,
                chapter: req.body.chapter,
            })
            imgChapManga.save(function(err){
                if(err){
                    console.log(err)
                }
                else{
                    const name = DetailManga.findOne({
                        slug: req.params.slug
                    })
                        .then((nameM) => {
                            if(nameM == null){
                                const details = new DetailManga({
                                    _id: new mongoose.Types.ObjectId(),
                                    tentruyen: req.params.slug,
                                    ImgDetail: imgChapManga._id,
                                })
                                console.log(details)
                                details.save()
                                    .then(() => res.redirect('/admin/manga'))
                                    .catch(err =>{
                                        res.json(err)
                                    })
                            }
                            else{
                                DetailManga.updateOne({slug: req.params.slug }, {
                                    $push:{
                                        ImgDetail: imgChapManga._id,
                                    }
                                }, function(err){
                                    if(err){
                                        res.json(err)
                                    }
                                    else{
                                        res.redirect('/admin/manga')
                                    }
                                })
                            }
                        })
                        .catch((err) => res.json(err))
                    
                }
            })      
        }
    }
    mangaRentals(req, res, next){
        Manga.find({chothue: true})
        .then((mangas) => {
            res.render('admins/mangas/rentals-list', {
                mangas: multipleMongooseToOject(mangas),
                layout: 'admin.hbs'
            })
        })
            
    }

    detailsRentalManga(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({})
        ])
            .then(([mangas, rentals]) => {
                if(mangas != null){  
                    for(var i =0;i< rentals.length; i++){
                        if(mangas._id.toString() ==  rentals[i].idManga){
                            
                            return res.render('admins/mangas/details-rental-manga', {
                                mangas: mongooseToOject(mangas),
                                rentals: mongooseToOject(rentals[i]),
                                layout: 'admin.hbs'
                            })
                        }
                    }
                    
                }
                else{
                    res.json('Không tìm thấy truyện')
                }
                console.log(mangas._id.toString())
            })
            .catch(next)
    }

    retailsCreateBooks(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({})
        ])    
        .then(([mangas, rentals]) => {
            if(mangas != null){
                for(var i =0;i< rentals.length; i++){
                    if(mangas._id.toString() ==  rentals[i].idManga){
                        for(var j = rentals[i].books.length -1; j >= 0; j--){
                            res.render('admins/mangas/rentals-create', {
                                mangas: mongooseToOject(mangas),
                                rentals: mongooseToOject(rentals[i].books[j]),
                                layout: 'admin.hbs'
                            })
                            break
                        } 
                    }
                }
            }
            else{
                res.json('Không tìm thấy truyện này!!!')
            }
        })
    }

    async retailsCreate(req, res, next){
        Promise.all([Manga.findOne({slug: req.params.slug}), RentalForManga({})])
        .then(([mangas , rentals])=>{
            let booksNew =  {  
                tentap: req.body.numberVol,
                anhbia: req.file.filename, 
                gia: req.body.price,
                soluong: req.body.amount,
                tacgia:req.body.author, 
                nxb: req.body.publisher,
                _id: new mongoose.Types.ObjectId(),
            }
            RentalForManga.findOneAndUpdate(
                { 
                    idManga: mangas._id
                }, 
                {
                    $push: { books: booksNew } 
                },
                {
                    new: true
                }
            )    
                .then((rentals) => Manga.findOneAndUpdate(
                    {
                        _id: mangas._id
                    },
                    {
                        $push: {
                            truyenchothue: booksNew._id
                        }
                    },
                    {
                        new: true
                    }
                    )
                    .then((rentals)=> res.json(rentals))
                )
                console.log(booksNew)
                .catch(next)
        .catch(next)
        })
    }
    
    //search with tentruyen or tenkhac
    async search(req, res, next){
        const value = req.query.tentruyen
        await Manga.find({
            $or:[
                {tentruyen: {$regex: new RegExp(value), $option: 'i'}},
                {tenkhac: {$regex: new RegExp(value), $option: 'i'}}
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
    //Categorys
    //[GET] /admin/categorys
    categorys(req, res, next){
        Promise.all([   Category.find({}).sorttable(req), 
                        Category.countDocumentsDeleted(),
                    ])
            .then(([categorys, deleteCount]) =>{
                res.render('categorys/categoryList',{
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
                res.render('categorys/categoryTrash',{
                    categorys: multipleMongooseToOject(categorys),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[GET]  /admin/categorys/formCategoryCreate
    formCategoryCreate(req, res, next){
        res.render('admins/create-category',{
            layout: 'admin.hbs'
        })
    }
    //[POST]
    categoryCreate(req, res, next){
        const data = req.body
        const category = new Category(data)
        category.save()
        .then(()=> res.status(200).json({message: "Thêm thành công"}))
        .catch(err =>{
            const errors = handleErrors(err) 
            res.status(400).json( { errors } )
        })
        
    }
    //[GET] /categorys/:id/categoryEdit
    categoryEdit(req, res, next){
        Category.findById(req.params.id)
            .then(theloais => res.render('categorys/categoryEdit',{
                    theloais: mongooseToOject(theloais),
                    layout: 'admin'
            }))
            .catch(next)
    }
    //[PUT] /categorys/:id
    async categoryUpdate(req, res, next){
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
                res.render('categorys/categoryTrash',{
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
                users: multipleMongooseToOject(users)
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
