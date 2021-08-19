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

// Page size
const PAGE_SIZE = 5

class CategoryController{
    //Categorys
    //[GET] /admin/categorys
    categories(req, res, next){
        var page = req.query.page
        if(page){   
            //get page
            page = parseInt(page)
            if(page < 1){
                page = 1
            }
            var soLuongBoQua = (page-1) * PAGE_SIZE  
            categoies_model.find({})
            .skip(soLuongBoQua)
            .sorttable(req)
            .limit(PAGE_SIZE)

            .then(async (categories) =>{
                categoies_model.countDocuments({})
                .then(async (total)=>{
                    var pages = Math.ceil(total / PAGE_SIZE)
                    const deleteCount = await categoies_model.countDocumentsDeleted()
                    res.json({
                        categories,
                        pages
                    })
                })
            }) 
            .catch(next)
        }else{ 
            categoies_model.find({})
            .sorttable(req)
            .limit(PAGE_SIZE)
            
            .then(async (categories) =>{
                categoies_model.countDocuments({})
                .then(async (total)=>{
                    var pages = Math.ceil(total / PAGE_SIZE)
                    
                    const deleteCount = await categoies_model.countDocumentsDeleted()
                    // res.json({
                    //     categories,
                    //     pages
                    // })
                    res.render('admins/categories/categoryList',{
                        pages,
                        deleteCount,
                        categories: multipleMongooseToOject(categories),
                        layout: 'admin'
                    })
                })
            }) 
            .catch(next)
        }
    }
    categoryTrash(req, res, next){
        categoies_model.findDeleted({})
            .then(categories =>{
                res.render('admins/categories/categoryTrash',{
                    categories: multipleMongooseToOject(categories),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[GET]  /admin/categorys/formCategoryCreate
    formCategoryCreate(req, res, next){
        res.render('admins/categories/categoryCreate',{
            layout: 'admin.hbs'
        })
    }
    //[POST]
    categoryCreate(req, res, next){
        const data = req.body
        const categories = new categoies_model(data)
        categories.save()
        .then(()=> res.status(200).json({message: "Thêm thành công"}))
        .catch((err) =>{
            const errors = handleErrors(err)
            res.status(400).json( { errors } )
        })
        
    }
    //[GET] /categorys/:id/categoryEdit
    async categoryEdit(req, res, next){
        const category = await categoies_model.findById(req.params.id)
            .then((category)=>{
                console.log(category)
                res.render('admins/categories/categoryEdit',{
                    category: mongooseToOject(category),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[PUT] /categorys/:id
    async categoryUpdate(req, res, next){
        const formdata = req.body
        await categoies_model.updateOne({ _id: req.params.id }, formdata)
            .then(() => res.redirect('../categories'))
            .catch(next)
    }
    //[DELETE] /categorys/:id
    categoryDelete(req, res, next){
        categoies_model.delete({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[GET] /categorys/categoryTrash
    categoryTrash(req, res, next){
        categoies_model.findDeleted({})
            .then(theloais =>{
                res.render('admins/categories/categoryTrash',{
                    theloais: multipleMongooseToOject(theloais),
                    layout: 'admin'
                })
            })
            .catch(next)
    }
    //[PATCH] /categorys/:id
    categoryRestore(req, res, next){
        categoies_model.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }

    //[DELETE] /categorys/:id/categoryForceDelete
    categoryForceDelete(req, res, next){
        categoies_model.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[PATCH] /categorys/:id/categoryRestore
    categoryRestore(req, res, next){
        categoies_model.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[POST] /categorys/handle-form-actions
    handleFormActions(req, res, next){
        switch(req.body.action){
            case 'delete':
                categoies_model.delete({ _id: {$in: req.body.categoryIds }})
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;
            case 'restore':
                categoies_model.restore({ _id: {$in: req.body.categoryIds }})
                    .then(() => res.redirect('back'))
                    .catch(next)
                    break
            case 'deleteForce':
                categoies_model.deleteMany({ _id: {$in: req.body.categoryIds }})   
                    .then(() => res.redirect('back'))
                    .catch(next)
                    break
            default:
                res.json(req.body)
        }
    }
}
module.exports = new CategoryController