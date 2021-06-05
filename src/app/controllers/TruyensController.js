const Truyen = require('../models/Truyen')
const { mongooseToOject } = require('../../ultil/mongoose')
class TruyensController{

    
    index(req,res,next){
        // Truyen.find({}, function (err, truyens) {
        //     if(!err){
        //         res.json(truyens)
        //         return
        //     }
        //     res.status(400).json({ error: 'Err!'})
                
        // })

        Truyen.find({})
            .then(truyens => res.render('truyens',{
                truyens: truyens
            }))
            .catch(next)

    }
    //[GET] /truyens/:slug/
    show(req, res, next){
        Truyen.findOne({ slug: req.params.slug })
            .then(truyen => {
                res.render('truyens', {truyen: mongooseToOject(truyen)})
            })
            .catch(next)
        
    }
}

module.exports = new TruyensController()