const Manga = require('../models/Manga')
const { mutipleMongooseToOject } = require('../../util/mongoose')
class MangasController{

    
    index(req,res,next){
        Manga.find({})
            .then(mangas => {
                res.render('mangas/detail', {
                    mangas: mutipleMongooseToOject(mangas)
                })
            })
            .catch(next)
    }
    //[GET] /truyens/:slug/
    show(req, res, next){
        Truyen.findOne({ slug: req.params.slug })
            .then(mangas => {
                res.render('mangas/mangaDetail', {
                    mangas: mongooseToOject(mangas)
                })
            })
            .catch(next)
        
    }
}

module.exports = new MangasController()