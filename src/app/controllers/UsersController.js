const Manga_Model = require('../models/Manga')

class UsersController{
    // [GET] /news
    index(req , res ){
        res.render('home')
    }

    autocomplete(req, res, next){
        var regex = new RegExp(req.query["term"], 'i')
        var name = Manga_Model.find({tentruyen: regex}, {'tentruyen':1}).sort({"update_at": -1}).sort({"create_at": -1}).limit(20)
        name.exec(function(err, data){
            console.log(data)
            var result = []
            if(!err){
                if(data && data.length && data.length >0){
                    data.forEach(mangas => {
                        let obj = {
                            id: mangas._id,
                            label: mangas.tentruyen,
                        }
                        result.push(obj)
                    })
                }
                res.jsonp(result)
            }
        })
    }
}

module.exports = new UsersController