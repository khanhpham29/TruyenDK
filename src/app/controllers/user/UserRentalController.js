const manga_model = require('../../models/Manga')
const detailManga_model = require('../../models/DetailManga')
const imageDetail_model = require('../../models/ImageDetail')
const rental_model = require('../../models/MangaRental')
const category_model = require('../../models/CategoryManga')
const book_model = require('../../models/book')
const user_model = require('../../models/User')
const cart_model = require('../../models/Cart')
const post_model = require('../../models/post')
const comment_model = require('../../models/comment')
const DetailsCart_Model = require('../../models/DetailCart')
const follow_model = require('../../models/FollowManga')
const notifies_model = require('../../models/Notifies')
const favourites_model = require('../../models/Favourite')
const bcrypt = require('bcrypt')
const { multipleMongooseToOject } = require('../../../util/mongoose')
const { mongooseToOject } = require('../../../util/mongoose')

class UserRentalController{
    async rentalOfManga(req, res, next){
        const rentals = await rental_model.find({}).populate('books')
        .then((rentals)=>{
            res.render("users/listRental",{
                rentals: multipleMongooseToOject(rentals)
            })
        })
        .catch(next)
    }
    async addToCart(req, res, next){
        req.user.addToCart(req.params.id)
        .then((a) =>{
            console.log(a)
            if(a == false){
                res.json({
                    message:"Tập truyện này đã có trong giỏ hàng!",
                }) 
            }
            else{
                const user = req.user
                res.json({
                    message:"Thêm vào giỏ hàng thành công",
                    user
                })
            } 
        }).catch( err => console.error(err))
    }
    async getCart(req, res, next){
        req.user
            .populate('cart.items.bookId')
            .execPopulate()
            .then(user =>{
                const cart = user.cart
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
        const cart = new cart_model({
            phone: req.user.phone,
            totalPrice: req.body.totalPrice
        })
        cart.save()
        .then((cart) =>{
            let cartUser = req.user.cart.items
            const items = req.body.items
            const detailCart = new DetailsCart_Model({
                //numberRental: req.body.numberRental,
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
                cart_model.updateOne(
                    {
                        _id: cart._id
                    }, 
                    {
                        idDetailCart: detailCart._id,
                    },
                )
                .then(() => console.log("update thành công"))
                .catch(next)
                const findUser = user_model.updateOne({
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

    decreaseProductCarts(req, res, next){
        req.user.amountMinus(req.params.id)
            .then((user) =>{
                const cart = user.cart
                res.json(cart)
            })
            .catch( err => console.error(err))
    }
}
module.exports = new UserRentalController