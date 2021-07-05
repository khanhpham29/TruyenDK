const Manga = require('../models/Manga')
const Detail = require('../models/DetailManga')
const Category = require('../models/CategoryManga')
const multer = require('multer')
const path = require('path')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const { PromiseProvider } = require('mongoose')

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
            .then(([theloais, deleteCount]) =>{
                res.render('categorys/categoryList',{
                    deleteCount,
                    theloais: multipleMongooseToOject(theloais)
                })
            })
            .catch(next)
    }
    categoryTrash(req, res, next){
        Category.findDeleted({})
            .then(theloais =>{
                res.render('categorys/categoryTrash',{
                    theloais: multipleMongooseToOject(theloais)
                })
            })
            .catch(next)
    }
    //[GET]  /admin/categorys/formCategoryCreate
    formCategoryCreate(req, res, next){
        res.render('admins/create-category')
    }
    //[POST]
    categoryCreate(req, res, next){
        const formdata = req.body
        const theLoai = new Category(formdata)
        theLoai.save()
            .then(()=> res.redirect(`categorys`))
    }
    //[GET] /categorys/:id/categoryEdit
    categoryEdit(req, res, next){
        Category.findById(req.params.id)
            .then(theloais => res.render('categorys/categoryEdit',{
                    theloais: mongooseToOject(theloais)
                })
            )
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
}

module.exports = new AdminController()
