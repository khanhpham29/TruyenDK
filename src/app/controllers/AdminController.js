const Manga = require('../models/Manga')
const Category = require('../models/CategoryManga')
const { mutipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
class AdminController{
    
    index(req,res,next){
        Manga.find({})
            .then(mangas => {
                res.render('mangas/mangaList', {
                    mangas: mutipleMongooseToOject(mangas)
                })
            })
            .catch(next)
    }
    //[GET]
    formMangaCreate(req, res, next){
        res.render('admins/create-manga')
    }
    //[POST]
    mangaCreate(req, res, next){
        const manga = new Manga(req.body)
        manga.save()
    }
    //Categorys
    //[GET]
    categorys(req, res, next){
        Category.find({})
            .then(theloais =>{
                res.render('categorys/categoryList',{
                    theloais: mutipleMongooseToOject(theloais)
                })
            })
            .catch(next)
    }
    //[GET]
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
        await Category.updateOne({ _id: req.params.id  }, formdata)
            .then(() => res.redirect('../categorys'))
            .catch(next)
    }
    //[DELETE] /categorys/:id
    categoryDelete(req, res, next){
        Category.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
}

module.exports = new AdminController()
