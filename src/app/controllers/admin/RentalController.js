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

class RentalController {
    //---------------------------RENTALS----------------------------------------//

    newRentals(req, res, next){
        Cart_Model.find({status: 'Chưa xác thực'})
        .populate({
            path: 'idDetailCart',
            populate:{
                path: 'listRentalBooks.items.bookId'
            }
        })
            .then((cart) => {
                res.render('admins/carts/newCart', {
                    cart: multipleMongooseToOject(cart),
                    layout: 'admin'
                })
            })
            .catch(next)
    }

    confirmNewRentals(req, res, next){
        Cart_Model.updateOne(
            {_id: req.params.id}, 
            {
                status: 'Đã xác nhận'
            })
        .then(cart => console.log(cart))
    }


    confirmRentals(req, res, next){
        Cart_Model.find({status: 'Đã xác nhận'})
            .then((cart) => {
                res.render('admins/carts/confirmCart', {
                    cart: multipleMongooseToOject(cart),
                    layout: 'admin'
                })
            })
            .catch(next)
    }

    confirmToRentals(req, res, next){
        Cart_Model.updateOne(
            {
                _id: req.params.id
            },
            {
                status: 'Đã nhận'
            })
            .then((cart) => {
                console.log(cart)
            })
            .catch(next)
    }

    payRentals(req, res, next){
        Cart_Model.find({status: 'Đã nhận'})
            .then((cart) => {
                res.render('admins/carts/payCart', {
                    cart: multipleMongooseToOject(cart),
                    layout: 'admin'
                })
            })
            .catch(next)
    }

    detailPayRentals(req, res, next){
        Cart_Model.findOne({_id: req.params.id})
        .populate({
            path: 'idDetailCart',
            populate:{
                path: 'listRentalBooks.items.bookId'
            }
        })
            .then((cart) => { 
                // res.json(cart)
                res.render('admins/carts/detailCart', {
                    cart: mongooseToOject(cart),
                    layout: 'admin'
                })
            })
            .catch(next)
    }

    payBookRentals(req, res, next){
        console.log(req.body)
        DetailsCart_Model.updateOne({
            idCart: req.params.id
        },{
            datePay: req.body.datePay
        })
        Cart_Model.updateOne({_id: req.params.id },{ status: 'Đã hoàn thành' })
        .then((cartUp) => console.log(cartUp))
        DetailsCart_Model.findOne({
            idCart: req.params.id
        })
        .then(cart => {console.log(cart)})

        // Cart_Model.findOne({_id: req.params.id }).populate('idDetailCart')
        // .then((cart) => {
        //     idDetailCart
        //     res.json({message: 'Phiếu thuê dã hoàn thành'})
        // })  
        .catch(err => console.log("loi"))    
    }

    userRentalsList(req, res, next){
        Cart_Model.find({}).sort({ createAt: -1 })
        .then((cart) => {
            res.render('admins/carts/cart-list', {
                cart: multipleMongooseToOject(cart),
                layout: 'admin'
            })
        })
        .catch(next)
    }

    paidOneBook(req, res, next){    
        const idRentalBook = req.params.id
        console.log('pay 1 book', req.body)
        DetailsCart_Model.findOne({idCart: req.body.idCart})
        .then(async (detailCart) => {
            const indexItems = detailCart.listRentalBooks.items.findIndex(objInItems =>{
                return new String(objInItems.bookId).trim() == String(idRentalBook).trim()
            })
            if( indexItems >= 0 ){
                //detailCart.listRentalBooks.items[indexItems].status = "Đã trả " + req.body.amountPaid + " cuốn"
                //detailCart.listRentalBooks.items[indexItems].amountPaid = req.body.amountPaid
                //if( detailCart.listRentalBooks.items[indexItems].amountPaid == detailCart.listRentalBooks.items[indexItems].amount ){
                detailCart.listRentalBooks.items[indexItems].status = "Đã trả"
                detailCart.listRentalBooks.items[indexItems].datePayBook = req.body.datePayBook
                detailCart.listRentalBooks.items[indexItems].statusBook = req.body.statusBook
                detailCart.save()
                if(req.body.statusBook == 'Nguyên vẹn' || req.body.statusBook == 'Hư hại nhẹ'){
                    console.log('cộng số lượng')
                    book_model.findOne({_id: detailCart.listRentalBooks.items[indexItems].bookId})
                    .then((book) => {
                        book_model.updateOne({_id: detailCart.listRentalBooks.items[indexItems].bookId},{
                            amount: book.amount + 1
                        })
                        .then(() => console.log('update thành công'))
                        .catch(() => console.log('loi'))
                    })
                    .catch((next))
                }
            }           
        })
    }


    rejectRentals(req, res, next){
        Cart_Model.updateOne({_id: req.params.id}, {
            status: 'Hủy',
            reason: req.body.reasonReject,
            $push: { 
                arrayStatus: req.body.statusRejectRental
            }
        })
        .then(() => {
            res.json({
                resonReject: req.body.reasonReject,
                message: "Sửa thành công"
            })
        })
        .catch(next)
    }
    detailRentals(req, res, next){
        const detailCart = DetailsCart_Model.findOne({idCart: req.params.id})
        .populate({
            path: 'listRentalBooks.items.bookId',
        })
        .populate({
            path: 'idCart',
        })
        .then((detailCart) => {
            // res.json(detailCart)
            res.render('admins/carts/cart-detail', {
                detailCart: mongooseToOject(detailCart),
                layout:'admin'
            })
        })
    }

    pagnination(req,res, next){
        let perPage = 16; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1; 
        DetailsCart_Model
        .find() // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, products) => {
            DetailsCart_Model.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
            if (err) return next(err);
                res.render('admins/test', {
                details, // sản phẩm trên một page
                current: page, // page hiện tại
                pages: Math.ceil(count / perPage) // tổng số các page
              }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
            });
        });
    }
}
module.exports = new RentalController