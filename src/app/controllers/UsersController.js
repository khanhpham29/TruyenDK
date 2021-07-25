const manga_model = require('../models/Manga')
const detailManga_model = require('../models/DetailManga')
const imageDetail_model = require('../models/ImageDetail')
const rental_model = require('../models/MangaRental')
const category_model = require('../models/CategoryManga')
const book_model = require('../models/book')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
class UsersController{
    // [GET] /news
    index(req,res,next){
        manga_model.find({})
            .then(mangas => {
                res.render('home', {
                    mangas: multipleMongooseToOject(mangas),
                    layout: 'user.hbs'
                })
            })
            .catch(next)
    }
    async detailManga(req, res, next){
        const detailManga =  await detailManga_model.findOne({ slug: req.params.slug })
        Promise.all([
            manga_model.findOne({ slug: req.params.slug }).populate('theloai'),
            detailManga_model.findById({ _id: detailManga._id }).populate({
                path:"ImgDetails",
                options: { sort: { createdAt: -1 } }
            })
        ])
            .then(([truyen, detailManga]) => {
                if(truyen == null){
                    return res.render('null')                   
                }
                else{
                    res.render('users/detailManga', {
                        truyen: mongooseToOject(truyen),
                        detail: mongooseToOject(detailManga),
                        layout: 'user.hbs'
                    })
                }
            })
            .catch(next)
    }
    async readManga(req, res, next){
        const chapter = await imageDetail_model.findById({ _id: req.params.id})
        .then((chapter)=>{
            res.render('users/chapter',{
                chapter: mongooseToOject(chapter)
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
                // res.json(user)
                const cart = user.cart
                // res.json(cartArr)
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
}

module.exports = new UsersController