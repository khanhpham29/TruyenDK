const Truyen = require('../models/Truyen')
// hay sai cai exports t thayben truyen no k co mau
class TruyensController{

    index(req , res ){
        res.render('truyens')
    }
    findById(req,res,next){
        if(req.params.id){
            Truyen.getTruyenById(req.params.id,function(err,rows){
                if(err){
                    res.json(err)
                }else{
                    res.json(rows)
                }
            })
        }else{
            Truyen.getAllTruyen(function(err,rows){
                if(err){
                    res.json(err)
                }else{
                    res.json(rows)
                }
            })
        }
    }
}

module.exports = new TruyensController