const Truyen = require('../models/Truyen')
class TruyensController{
    
    index(req,res,next){
        Truyen.find({})
            .then(truyens => res.render('truyens',{
                truyens: truyens
            }))
            .catch(next)
    }
}

module.exports = new TruyensController()