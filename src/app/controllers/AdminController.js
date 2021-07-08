const Manga = require('../models/Manga')
const Detail = require('../models/DetailManga')
const Category = require('../models/CategoryManga')
const post_model = require('../models/post')
const comment_model = require('../models/comment')
const multer = require('multer')
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
    }
    //[GET]
    formMangaCreate(req, res, next){
        res.render('admins/create-manga')
    }
    //[POST]
    async mangaCreate(req, res, next){
        const manga = new Manga({
            tentruyen: req.body.nameManga,
            tenloai: req.body.abc,
            theloai: req.body.category,
            mota: req.body.description,
            hinh: req.file.filename,
        })
        await manga.save(function(err){
            if(err){
                res.json({'kq': 0, 'errMess':err})
            }
            else{
                return res.redirect('/admins/manga');
            }
        })
    }
    manga(req, res, next){
        Manga.find({})
            .then(mangas => {
                res.render('admins/manga', {
                    mangas: multipleMongooseToOject(mangas)
                })
            })
            .catch(next)   
    }

    infoManga(req, res, next){
        Manga.findOne({ slug: req.params.slug })
            .then(truyen => {
                res.render('admins/details-manga', {truyen: mongooseToOject(truyen)})
            })
            .catch(next)
    }
    //hiển thị danh sách img trong chap
    tam(req, res, next){
        const all_img =  Detail.find()
        // res.send('abc')
        res.render('admins/test', {all_img: all_img})
        
    }
    //Mở form thêm chap
    createChapterManga(req,res,next){
        Manga.findOne({ slug: req.params.slug })
        .then(truyen => {
            res.render('admins/create-chapter-manga', {truyen: mongooseToOject(truyen)})
        })
        .catch(next)
    }
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
                    filePath: element.path,
                }
                filesArr.push(file)
            });
            const details = new detail({
                tentruyen: req.body.nameManga,
                chapter: req.body.chapter,
                imgManga: filesArr,
            })
            // res.json(detailsChapManga)
            details.save(function(err){
                if(err){
                    res.json(err)
                }
                else{
                    res.json('abc')
                }
            })
        }
    }
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
        res.render('admins/create-category',{layout: 'admin'})
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
            .then(categorys => res.render('categorys/categoryEdit',{
                    categorys: mongooseToOject(categorys),
                    layout: 'admin'
                })
            )
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
