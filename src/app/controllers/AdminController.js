const Truyen = require('../models/Truyen')
class AdminController{
    
    index(req,res,next){
        Truyen.find({})
            .then(truyens => res.render('truyens',{
                truyens: truyens
            }))
            .catch(next)

    }
    createManga(req, res, next){
        res.render('admin/create-manga')
    }

    //[POST]
    create(req, res, next){
        const truyen = new Truyen(req.body)
        truyen.save()
    }
}

module.exports = new AdminController()
