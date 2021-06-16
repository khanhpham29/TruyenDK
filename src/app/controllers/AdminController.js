const Manga = require('../models/Manga')
const Detail = require('../models/DetailManga')
const ImgDetail = require('../models/ImageDetail')
const Category = require('../models/CategoryManga')
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const { PromiseProvider } = require('mongoose')
class AdminController{
    

    index(req,res,next){
        Manga.find({})
            .then(mangas => {
                res.render('mangas/mangaList', {
                    mangas: multipleMongooseToOject(mangas)
                })
            })
            .catch(next)
    }
    //Mở form thêm manga
    //[GET] /manga/add
    formMangaCreate(req, res, next){
        Category.find({})
            .then(categories => {
                res.render('admins/create-manga', { categories:  multipleMongooseToOject(categories)})
            })
            .catch(err => res.json(err))
        
    }
    //Thêm manga
    //[POST] /manga/add
    mangaCreate(req, res, next){
        const manga = new Manga({
            tentruyen: req.body.nameManga,
            theloai: req.body.category,
            mota: req.body.description,
            hinh: req.file.filename,
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
    //form edit manga
    //[GET] /manga/edit
    formMangaEdit(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}), 
            Category.find({}),
        ])
            .then(([mangas, categories]) => {
                    res.render('admins/edit-manga', { 
                        mangas: mongooseToOject(mangas),
                        categories:  multipleMongooseToOject(categories)
                    })
                })
            .catch(next)
    }   
    

    //form edit manga
    //[POST] /manga/edit
    mangaEdit(req, res, next){
        res.json(req.body)
    }
    // [GET] /manga
    // Hiển thị tất cả manga trong db
    manga(req, res, next){
        Manga.find({})
            .then(mangas => {
                res.render('admins/manga', {
                    mangas: multipleMongooseToOject(mangas)
                })
            })
            .catch(next)   
    }
    // [GET] /manga/:slug
    //Thông tin chi tiết của 1 manga
    infoManga(req, res, next){
        Promise.all([
            Manga.findOne({ slug: req.params.slug }),
            Detail.find({ slug: req.params.slug })
        ])
            .then(([truyen, chap]) => {
                //res.json(chap)
                res.render('admins/details-manga', {
                    truyen: mongooseToOject(truyen),
                    chap: multipleMongooseToOject(chap)
                })
            })
            .catch(next)
    }
    //hiển thị danh sách img trong chap
    // [GET]/manga/:tentruyen/:chapter
     readChap(req, res, next){
         Promise.all([
            Detail.findOne({tentruyen: req.params.tentruyen})
                .populate('ImgDetail'), 
            ImgDetail.find({chapter: req.params.chapter})
         ])            
            .then(([name, chap]) => {
                for(var i = 0; i < chap.length;i++){                   
                        //console.log(chap[i]._id)
                        for(var j =0;j<name.ImgDetail.length;j++){
                            //console.log(name.ImgDetail[j])
                            if(chap[i]._id.toString() === name.ImgDetail[j].toString()){
                                res.render('admins/details-manga-img', {chapImg: chap[i]})
                            }
                        }
                    }     
                })
                // name.forEach(function(names, index1){
                //     chap.forEach(function(chaps, index2){
                //         if(names.ImgDetail.toString() == chaps._id.toString()){
                //             res.json(chaps)
                //             break
                //         }
                //     })
                // })            
            //})
            .catch(err => {res.json(err)})
     }   
    //Mở form thêm chap
    //[GET] /manga/:tentruyen/addChap
    createChapterManga(req,res,next){
        Manga.findOne({ slug: req.params.slug })
        .then(truyen => {
            res.render('admins/create-chapter-manga', {truyen: mongooseToOject(truyen)})
        })
        .catch(next)
    }
    //Thêm chap
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
            const imgChapManga = new ImgDetail({
                _id: new mongoose.Types.ObjectId(),
                imgManga: filesArr,
                chapter: req.body.chapter,
            })
            imgChapManga.save(function(err){
                if(err){
                    console.log(err)
                }
                else{
                    const name = Detail.findOne({
                        slug: req.params.slug
                    })
                        .then((nameM) => {
                            if(nameM == null){
                                // console.log('abc')
                                // res.json(nameM)
                                const details = new Detail({
                                        _id: new mongoose.Types.ObjectId(),
                                        tentruyen: req.body.nameManga,
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
                                Detail.updateOne({slug: req.params.slug }, {
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
