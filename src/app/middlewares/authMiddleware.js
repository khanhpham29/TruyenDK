const jwt = require('jsonwebtoken')
const User = require('../models/User')


const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt
    //check json web tolen exists & is verified
    if(token){
        jwt.verify(token, 'next user secret', (err, decodedToken)=>{
            if (err){
                console.log(err,message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'next user secret',async (err, decodedToken)=>{
            if(err){
                // console.log(err,message)
                res.locals.user = null
                res.status(500).json('token khong hop le')
                next()
            }else{
                let user = await User.findById(decodedToken.id)
                // console.log(user)
                req.data = user
                res.locals.user = user.toObject()
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }   
}
const checkMember = (req, res, next) =>{
    if (req.data)
    {
        let role = req.data.role
        if (role ==='member' || role === 'admin')
        {
            next()
        }else{
            res.json('NOT PERMISSON')
        }
    }
    else{
        res.locals.user = null
        next()
    }
}
const checkAdmin = (req, res, next) =>{
    if (req.data)
    {
        let role = req.data.role
        if (role === 'admin')
        {
            next()
        }else{
            res.json('NOT PERMISSON')
        }
    }
    else{
        res.locals.user = null
        next()
    }
}


module.exports = { requireAuth, checkUser , checkMember , checkAdmin }