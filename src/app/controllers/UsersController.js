const manga_model = require('../models/Manga')
const detailManga_model = require('../models/DetailManga')
const imageDetail_model = require('../models/ImageDetail')
const rental_model = require('../models/MangaRental')
const category_model = require('../models/CategoryManga')
const book_model = require('../models/book')
const User_Model = require('../models/User')
const Cart_Model = require('../models/Cart')
const DetailsCart_Model = require('../models/DetailCart')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
class UsersController{
    // [GET] /news
    index(req,res,next){
        manga_model.find({})
        .populate({
            path:'idDetailManga',
            populate:{ 
                path:'imgDetails',
                model:'ImgDetail',
                match: {new: true}
            }
        })
            .then((mangas) => {
                // res.json(mangas)
                res.render('home', {
                    mangas: multipleMongooseToOject(mangas),
                    layout: 'user.hbs'
                })
            })
            .catch(next)
    }
    async detailManga(req, res, next){
        Promise.all([
            manga_model.findOne({ slug: req.params.slug }).populate('category'),
            detailManga_model.findOne({ slug: req.params.slug }).populate({
                path:"imgDetails",
                options: { sort: { createAt: -1 } }
            })
        ])
            .then(([manga, detailManga]) => {
                if(manga == null){
                    return res.render('null')                   
                }
                else{
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
        const chapter = await imageDetail_model.findOne({ slug: req.params.slug})
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
                const cart = user.cart
                //console.log(cart.items)
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


    async userRentals(req, res, next){
        const cart = new Cart_Model({
            phone: req.user.phone,
            totalPrice: req.body.totalPrice
        })
        cart.save()
        .then((cart) =>{
            let cartUser = req.user.cart.items
            const items = req.body.items
            const detailCart = new DetailsCart_Model({
                numberRental: req.body.numberRental,
                idCart: cart._id,
                totalItem: req.user.cart.totalItem,
                totalPrice: req.user.cart.totalPrice,
            })
            detailCart.save()
            .then((detailCart)=>{  
                cartUser.forEach((item, i) =>{
                    detailCart.listRentalBooks.items.push({bookId: item.bookId, amount: item.amount})
                    const soluongthue =  detailCart.listRentalBooks.items[i].amount
                    book_model.findOne({_id: detailCart.listRentalBooks.items[i].bookId})
                    .then((book) => {
                        book_model.updateOne({_id: detailCart.listRentalBooks.items[i].bookId}, {
                            amount: (book.amount - soluongthue)
                        })
                        .then(() => console.log('update số lượng sách thành công!'))
                        .catch(next)
                    })
                    
                })
                detailCart.save()
                Cart_Model.updateOne(
                    {
                        _id: cart._id
                    }, 
                    {
                        idDetailCart: detailCart._id,
                    },
                )
                .then(() => console.log("update thành công"))
                .catch(next)
                const findUser = User_Model.updateOne({
                    _id: req.user._id
                },{
                    $push: {
                        idCart: cart._id
                    },
                    cart: {
                        totalItem: 0,
                        items: [],
                        totalPrice: 0,
                    }
                })
                .then(() => res.json({messge: 'Tạo đơn hàng thành công'}))
                .catch(next)
            })

        })
        .catch(next)
    }

    increaseProductCarts(req, res, next){
        req.user.amountPlus(req.params.id)
            .then((user) =>{
                const cart = user.cart
                res.json(cart)
            })
            .catch( err => console.error(err))
    }
}

module.exports = new UsersController