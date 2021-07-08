const Manga = require('../models/Manga')
const DetailManga = require('../models/DetailManga')
const ImageDetail = require('../models/ImageDetail')
const Category = require('../models/CategoryManga')
const RentalForManga = require('../models/RentalForManga')
const User_Model = require('../models/User')
const Cart_Model = require('../models/Cart')
const DetailsCart_Model = require('../models/DetailsCart')


const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')
const { multipleMongooseToOject } = require('../../util/mongoose')
const { mongooseToOject } = require('../../util/mongoose')
const { PromiseProvider } = require('mongoose')
const { listeners } = require('../models/Manga')

class AdminController{
    

    index(req,res,next){
        res.send('đây là trang admin')
    }
    //Mở form thêm manga
    //[GET] /manga/add
    formMangaCreate(req, res, next){
            Category.find({})
            .then(categories => {
                res.render('admins/mangas/create-manga', { categories:  multipleMongooseToOject(categories)})
            })
            .catch(err => res.json(err))
        
    }
    //Thêm manga
    //[POST] /manga/add
    mangaCreate(req, res, next){
        Manga.findOne({tentruyen: req.body.nameManga })
            .then(mangas =>{
                if(mangas == null || mangas.tinhtrang == 'Ngưng'){
                    

                    let cbRental = false
                    if(req.body.cbRental == 'true'){
                        cbRental = true
                        const manga =  new Manga({
                                tentruyen: req.body.nameManga,
                                tenkhac: req.body.nameManga2,
                                theloai: req.body.category,
                                mota: req.body.description,
                                hinh: req.files.avatarManga[0].filename,
                                chothue: req.body.cbRental,                    
                        })
                        manga.save(function(err){
                            if(err){
                                res.json({'errMess':err})
                            }
                            else{
                                const truyenChoThue = new RentalForManga({
                                    idManga: manga._id,
                                    books: [{  
                                        
                                        tentap: req.body.numberVol,
                                        anhbia: req.files.avatarNumberVol[0].filename, 
                                        gia: req.body.price,
                                        soluong: req.body.amount,
                                        tacgia:req.body.author, 
                                        nxb: req.body.publisher,
                                    }]
                                })
                                truyenChoThue.save()
                                
                                .then(() =>
                                    Manga.updateOne({_id: manga._id}, {
                                            $push:{truyenchothue :truyenChoThue.books[0]._id},
                                    }),
                                    
                                    res.redirect('/admin/manga')
                                    )
                                .catch(next)
                            }
                        })
                    }
                    else if(req.body.cbRental != 'true'){
                        const manga = new Manga({
                            tentruyen: req.body.nameManga,
                            tenkhac: req.body.nameManga2,
                            theloai: req.body.category,
                            mota: req.body.description,
                            hinh: req.files.avatarManga[0].filename,                      
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
                    
                }
                else{
                    res.json('Truyện đã tồn tại, xem lại!!!')
                }
            })
            .catch(next)
    }
    //form edit manga
    //[GET] /manga/edit
    formMangaEdit(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}), 
            Category.find({}),
        ])
            .then(([mangas, categories]) => {
                    res.render('admins/mangas/edit-manga', { 
                        mangas: mongooseToOject(mangas),
                        categories:  multipleMongooseToOject(categories)
                    })
                })
            .catch(next)
    }   
    

    //form edit manga
    //[POST] /manga/edit
    async mangaEdit(req, res, next){
        if(req.body.cbRental != "true"){
            req.body.cbRental = false
        }
        if(!req.file){
            await Manga.updateOne({ slug: req.params.slug }, {
                tentruyen: req.body.nameManga,
                tenkhac: req.body.nameManga2,
                tinhtrang: req.body.cbbStatus,
                theloai: req.body.category,
                mota: req.body.description,
                hinh: req.body.avatarManga2,
                chothue: req.body.cbRental,
            })
            .then(() => res.redirect('/admin/manga'))
            .catch(next)
        }
        else{
            await Manga.updateOne({ slug: req.params.slug }, {
                tentruyen: req.body.nameManga,
                tenkhac: req.body.nameManga2,
                tinhtrang: req.body.cbbStatus,
                theloai: req.body.category,
                mota: req.body.description,
                hinh: req.file.filename,
                chothue: req.body.cbRental,
            })
            .then(() => res.redirect('/admin/manga'))
            .catch(next) 
        }
    }
    // [GET] /manga
    // Hiển thị tất cả manga trong db
    manga(req, res, next){
        // console.log('User: ',req.user)
        Manga.find({})
            .then(mangas => {
                    res.render('admins/mangas/manga-list', {
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
            DetailManga.find({ slug: req.params.slug })
        ])
            .then(([truyen, chap]) => {
                //res.json(chap)
                if(truyen == null){
                    return res.render('null')                   
                }
                else{
                    res.render('admins/mangas/details-manga', {
                        truyen: mongooseToOject(truyen),
                        chap: multipleMongooseToOject(chap)
                    })
                }
                
            })
            .catch(next)
    }
    //hiển thị danh sách img trong chap
    //----------------------
    // [GET]/manga/:tentruyen/:chapter
    readChap(req, res, next){
        Promise.all([
            DetailManga.findOne({tentruyen: req.params.tentruyen}),
                //.populate('ImgDetail'), 
                ImageDetail.find({chapter: req.params.chapter})
        ])            
            .then(([name, chap]) => {
                if(name == null){
                    return res.render('null')
                }
                else if(chap == null){
                    return res.render('null')
                }
                else if(name != null && chap != null){
                    for(var i = 0; i < chap.length;i++){                   
                        for(var j =0;j<name.ImgDetail.length;j++){
                            console.log(i +' - '+ j +' : '+chap[i]._id + ' - ' + name.ImgDetail[j])
                            if(chap[i]._id.toString() === name.ImgDetail[j].toString()){
                                return res.render('admins/mangas/details-manga-img', {chapImg: chap[i]})
                            }
                        }
                    }
                    return res.render('null')    
                }
            })
            .catch(err => {res.json(err)})
    }   
    //Mở form thêm chap mới vào truyện
    //-------------------
    //[GET] /manga/:tentruyen/addChap
    createChapterManga(req,res,next){
        Manga.findOne({ slug: req.params.slug })
        .then(truyen => {
            res.render('admins/mangas/create-chapter-manga', {truyen: mongooseToOject(truyen)})
        })
        .catch(next)
    }
    //Thêm chap mới vào truyện
    //------------------
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
            const imgChapManga = new ImageDetail({
                _id: new mongoose.Types.ObjectId(),
                imgManga: filesArr,
                chapter: req.body.chapter,
            })
            imgChapManga.save(function(err){
                if(err){
                    console.log(err)
                }
                else{
                    const name = DetailManga.findOne({
                        slug: req.params.slug
                    })
                        .then((nameM) => {
                            if(nameM == null){
                                const details = new DetailManga({
                                    _id: new mongoose.Types.ObjectId(),
                                    tentruyen: req.params.slug,
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
                                DetailManga.updateOne({slug: req.params.slug }, {
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
    mangaRentals(req, res, next){
        Manga.find({chothue: true})
        .then((mangas) => {
            res.render('admins/mangas/rentals-list', {
                mangas: multipleMongooseToOject(mangas)
            })
        })
            
    }

    detailsRentalManga(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({})
        ])
            .then(([mangas, rentals]) => {
                if(mangas != null){  
                    for(var i =0;i< rentals.length; i++){
                        if(mangas._id.toString() ==  rentals[i].idManga){
                            
                            return res.render('admins/mangas/details-rental-manga', {
                                mangas: mongooseToOject(mangas),
                                rentals: mongooseToOject(rentals[i])
                            })
                        }
                    }
                    
                }
                else{
                    res.json('Khoong tìm thấy truyện')
                }
                console.log(mangas._id.toString())
            })
            .catch(next)
    }

    retailsCreateBooks(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({})
        ])    
        .then(([mangas, rentals]) => {
            if(mangas != null){
                for(var i =0;i< rentals.length; i++){
                    if(mangas._id.toString() ==  rentals[i].idManga){
                        for(var j = rentals[i].books.length -1; j >= 0; j--){
                            res.render('admins/mangas/rentals-create', {
                                mangas: mongooseToOject(mangas),
                                rentals: mongooseToOject(rentals[i].books[j])
                            })
                            break
                        } 
                    }
                }
            }
            else{
                res.json('Không tìm thấy truyện này!!!')
            }
        })
    }

    async retailsCreate(req, res, next){
        Promise.all([Manga.findOne({slug: req.params.slug}), RentalForManga({})])
        .then(([mangas , rentals])=>{
            let booksNew =  {  
                tentap: req.body.numberVol,
                anhbia: req.file.filename, 
                gia: req.body.price,
                soluong: req.body.amount,
                tacgia:req.body.author, 
                nxb: req.body.publisher,
                _id: new mongoose.Types.ObjectId(),
            }
            RentalForManga.findOneAndUpdate(
                { 
                    idManga: mangas._id
                }, 
                {
                    $push: { books: booksNew } 
                },
                {
                    new: true
                }
            )    
                .then((rentals) => Manga.findOneAndUpdate(
                    {
                        _id: mangas._id
                    },
                    {
                        $push: {
                            truyenchothue: booksNew._id
                        }
                    },
                    {
                        new: true
                    }
                    )
                    .then((rentals)=> res.json(rentals))
                )
                console.log(booksNew)
                .catch(next)
        .catch(next)
        })
    }
    
    //search with tentruyen or tenkhac
    async search(req, res, next){
        const value = req.query.tentruyen
        await Manga.find({
            $or:[
                {tentruyen: {$regex: new RegExp(value), $option: 'i'}},
                {tenkhac: {$regex: new RegExp(value), $option: 'i'}}
            ]
        }
        )
        .then((mangas) => res.render('admins/mangas/results-search-manga', {
            mangas: multipleMongooseToOject(mangas)
        }))
        .catch(next)
    }

    //---------------------------------------------------------------------------//
    
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

    //----------------------------------------------//
    //Rentals

    //[POST] /admin/rentals/callcard
    callCardUser(req, res, next){
        res.render('admins/rentals/form-customer')
    }
    //[POST] /admin/rentals/callcard
    callCard(req, res, next){
        Promise.all([
            User_Model.findOne({email: req.body.emailCustomer}),
            Manga.find({chothue: true})
        ])
        
        .then(([user, mangas]) => {

                // const user = new User_Model({
                //     email: req.body.emailCustomer,
                //     name: req.body.nameCustomer,
                //     phone: req.body.phoneCustomer,
                //     password: req.body.phoneCustomer,
                // })
                // user.save()
                res.render('admins/rentals/manga-rentals-list',{
                        mangas: multipleMongooseToOject(mangas)
                    })
        })

    }
    

    //[POST] /admin/rentals/addToCart
    async addToCart(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({})
        ])
            .then(([manga, rentals]) => {
                var books = req.body.bookIds
                let flag = false
                const detailsCart = new DetailsCart_Model({
                    _id: new mongoose.Types.ObjectId(),
                })
                detailsCart.save()
                .then((detailsCartNew) => {
                    console.log(detailsCartNew)
                    books.forEach((book) => {
                        console.log('Id books ng dùng chọn: ', book)
                        var booksRental = manga.truyenchothue
                        console.log('đây là sách cho thuê: ', booksRental)
                        booksRental.forEach((bookRentals) => {
                            console.log('Id books trong db: ', bookRentals)
                            if(bookRentals == book){
                                console.log(bookRentals, ' -------- ', book)
                                const idRentals = bookRentals
                                console.log(bookRentals)
                                DetailsCart_Model.findOneAndUpdate(
                                    { 
                                        _id: detailsCartNew._id
                                    }, 
                                    {
                                        $push: { idRentalBooks: bookRentals } 
                                    },
                                    {
                                        new: true
                                    }
                                )
                                .then((details) => console.log(details))
                            } 
                        })
                    })    
                    res.json(manga)
                })
                .catch(next)   
            })
            .catch(err => {
                console.log(err)
            })
    }
    //[GET]/admin/rentals/list
    listMangaRentals(req, res, next){
        Promise.all([
            User_Model.findOne({_id: req.params.id}),
            Manga.find({chothue: true})
        ])
        
        .then(([user, mangas]) => {
            res.render('admins/rentals/manga-rentals-list',{
                mangas: multipleMongooseToOject(mangas),
                member: mongooseToOject(user)
            })
        })
    }
    //[GET]/admin/rentals/list/:id/:slug
    detailsMangaRentals(req, res, next){
        Promise.all([
            Manga.findOne({slug: req.params.slug}),
            RentalForManga.find({}),
        ])
        .then(([mangas, rentals]) => {
            if(mangas != null){  
                for(var i =0;i< rentals.length; i++){
                    if(mangas._id.toString() ==  rentals[i].idManga){
<<<<<<< HEAD
                        console.log(user)
=======
>>>>>>> b2b9d40b4373f60f5ba828ff488b2b5d701246e4
                        return res.render('admins/rentals/manga-rentals-list-details', {
                            mangas: mongooseToOject(mangas),
                            rentals: mongooseToOject(rentals[i]),
                        })
                    }
                }
                
            }
            else{
                res.json('Không tìm thấy truyện')
            }
        })
        .catch(next)
    }


    //--------------USER--------------------//
    async listUsers(req, res, next){
        await User_Model.find({role: "member"})
        .then((users) => {
            res.render('admins/users/list-users', {
                users: multipleMongooseToOject(users)
            })
        })
        .catch(next)
    }

    async searchUsers(req, res, next){
        const value = req.query.user
        await User_Model.findOne({
            phone: {$regex: new RegExp(value)}
        }
        )
        .then((user) => res.render('admins/users/search-user', {
            user: mongooseToOject(user)
        }))
        .catch(next)
    }


}

module.exports = new AdminController()
