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

class AccountController{
    userAccount(req, res, next){
        user_model.findOne({_id: req.user.id})
        .then((user) => {
            res.render('users/account', {
                user: mongooseToOject(user)
            })
        })
    }

    async userAccountUpdate(req,res,next){
        const file = req.file
        if(file){
            user_model.updateOne({_id: req.user.id}, {
                avatar: file.filename
            })
            .then(() => {
                console.log('update avatar thành công')
            })
        }
        await user_model.updateOne({_id: req.user.id}, {
            name: req.body.name,
            gender: req.body.gender
        })
        .then(() => {
            console.log('thanh cong')
            res.redirect('/')
        })
        .catch(next)
    }

    viewRentalsHistory(req, res, next){
        user_model.findOne({_id: req.user._id}).populate('idCart')
        .then((user)=>{
            res.render('users/rentalsHistory',{
                user: mongooseToOject(user)
            })
        })
    }

    detailRentalsHistory(req, res, next){
        cart_model.findOne({_id: req.params.id})
        .populate({
            path: 'idDetailCart',
            populate:{
                path: 'listRentalBooks.items.bookId'
            }
        })
            .then((cart) => { 
                //res.json(cart)
                res.render('users/detailRentals', {
                    cart: mongooseToOject(cart),
                })
            })
            .catch(next)
    }
    
    formChangePassword(req, res, next){
        res.render('users/formChangePass')
    }

    async ChangePassword(req, res, next){
        let flag = 0
        await req.user.changePassword(req.user.email, req.body.password, req.body.passwordNew, req.body.passwordNewAgain)
        .then((a) => {     
            console.log(a)
            flag = 1
        })
        .catch((err)=>{
            const errors = handleErrors(err)
            res.status(400).json({errors})
        })
        if(flag == 1){
            const salt = await bcrypt.genSalt()
            const password  = await bcrypt.hash(req.body.passwordNew, salt)
            user_model.updateOne(
                {
                    _id: req.user._id
                }, 
                {
                    password: password
                }
            )
            .then((a) => {
                console.log("thành công",a)
                res.status(200).json({message: "true"})
            })
            .catch((err)=>{
                const errors = handleErrors(err)
                res.status(400).json({errors})
            })
        }
    }
}
module.exports = new AccountController