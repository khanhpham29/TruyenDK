const manga_model = require('../../models/Manga')
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


class MangaRentalController{
    // search rental manga
    async searchMangaRental(req, res, next){
    const rentals = await rental_model.find({})
        .then((rentals) => {
            res.json({
                rentals: multipleMongooseToOject(rentals),
            })
        })
        .catch(next)    
    }
    //---------------------------------------------------------------------------//
    //MangaRental
    async mangaRentals(req, res, next){
        const Rental = await rental_model.find({})
        .then((Rental) => {
            res.render('admins/rentals/rentalList', {
                rentals: multipleMongooseToOject(Rental),
                layout: 'admin.hbs'
            })
        })
    }
    async listMangaRentals(req, res, next){
        Promise.all([
            manga_model.findOne({ slug: req.params.slug })
            .populate('categories')
            .populate('idDetailManga'),
            detailmanga_model.findOne({ slug: req.params.slug }),
            book_model.find({ slug: req.params.slug}),
        ])
        .then(([manga, detail, list])=>{
            res.render("admins/rentals/detailRentalList",{
                manga: mongooseToOject(manga),
                detail: mongooseToOject(detail),
                list: multipleMongooseToOject(list),
                layout: 'admin.hbs'
            })
        })
        .catch((err) => {
            res.status(400).json({err})
        })
    }
    // form MangaRental
    formCreateBook(req, res, next){
        manga_model.find({
            lease: false
        })
        .then((mangas) => {
            res.render('admins/rentals/fromCreateBook', { 
                mangas:  multipleMongooseToOject(mangas),
                layout: 'admin.hbs'
            })
        })
        .catch(err => res.json(err))
    }
    async createMangaRental(req, res, next){
        try{
            if( req.file == null){
                res.status(400).json({message: "Vui lòng chọn hình"})
            }
            const formdata = req.body
            const rentalNew =  new rental_model({
                nameManga: formdata.nameManga,
                publiser: formdata.publiser,
                author: formdata.author,
                image: req.file.filename,
            })
            await rentalNew.save()
            manga_model.updateOne(
                { 
                    _id: formdata.id
                },
                {
                    $set: {
                        lease: true
                    }
                },function(err,data){
                    console.log(data)
                }
            )
            res.status(200).json({message:"Đã thêm truyện cho thuê thành công"})
        }
        catch{
            next()
        }
    }
    
    
    //[GET] /rentals/:slug/edit
    async formAddNewBook(req, res, next){
        const rental = await rental_model.findOne({
            slug: req.params.slug,
        })
        .then((rental)=>{
            // res.json(rental)
            res.render('admins/rentals/formAddNewBook',{
                rental: mongooseToOject(rental),
                layout: 'admin'
            })
        })
        .catch((err)=>{
            res.status(400).json(err)
        })
    }
    async AddNewBook(req, res, next){
        console.log(req.body)
        if( req.file == null){
            res.status(400).json({message: "Vui lòng chọn hình"})
        }
        const formdata = req.body
        const rental = await rental_model.findOne({slug: formdata.slug})
        .then(async (rental)=>{
            const episodeExists = await book_model.findOne({
                nameManga: rental.nameManga,
                episode: formdata.episode,
            })
            .then(async (episodeExists)=>{
                if(episodeExists != null)
                {
                    res.status(400).json({message: 'Tập này đã tồn tại'})
                }
                else{
                    let booksNew = {
                        nameManga: formdata.nameManga,
                        episode: formdata.episode,
                        image: req.file.filename,
                        cost: formdata.cost,
                        rentCost: formdata.rentCost,
                        covercost: formdata.coverCost,
                        amount: formdata.amount,
                    }
                    const bookNew = new book_model(booksNew)
                    bookNew.save()
                    rental.books.push(bookNew._id)
                    await rental.save()
                    .then((rental)=>{
                        res.json({message: "Đã thêm cuốn mới thành công"})
                    })
                    .catch((err)=>{
                        const errors = handleErrors(err)
                        res.status(400).json( { errors })
                    })
                }
            })
        })
    }
    //[GET] /rentals/:slug/edit
    async formUpdateMangaRental(req, res, next){
        const book = await book_model.findOne({
            slug: req.params.slug,
            episode: req.params.episode,
        })
        .then((book)=>{
            // res.json(book)
            res.render('admins/rentals/formUpdateRental',{
                book: mongooseToOject(book),
                layout: 'admin'
            })
        })
        .catch((err)=>{
            res.status(400).json(err)
        })
        
    }
    //[POST] /rentals/:slug/edit
    async EditMangaRental(req, res, next){
        const formdata = req.body
        if( req.file == null){
            const book = await book_model.updateOne({
                slug: req.params.slug,
                episode: req.params.episode,
            },formdata)
            .then(()=>{
                res.status(200).json({message: "Sửa thành công"})
            })
        }else{
            const book = await book_model.updateOne({
                slug: req.params.slug,
                episode: req.params.episode,
            },{
                nameManga: formdata.nameManga,
                episode: formdata.episode,
                image: req.file.filename,
                cost: formdata.cost,
                rentCost: formdata.rentCost,
                covercost: formdata.coverCost,
                amount: formdata.amount,
            })
            .then(()=>{
                res.status(200).json({message: "Sửa thành công"})
            })
        }
    }
}
module.exports = new MangaRentalController