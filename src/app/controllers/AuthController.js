const User = require('../models/User')
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
    let errors = { email: '', password: '', name: '', phone: ''}
    // sai tài khoản hoặc mật khẩu
    if(err.message === 'Sai tài khoản hoặc mật khẩu') {
        errors.email = 'Sai tài khoản hoặc mật khẩu'
    }

    // duplicate error code-point
    if( err.code === 11000){
        errors.email = 'Email này đã tồn tại'
        return errors
    }

    // validation erros
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// hàm tạo token
const maxAge = 3*24*60*60
const createToken = (id) =>{
    return jwt.sign( { id  }, 'next user secret', { 
        expiresIn: maxAge 
    })
}

class AuthController{

    index(req, res, next){
        res.render('admins/manga')
    }
    // [GET] /signup
    registerGet(req , res , next){
        res.render("auths/register")
    }
    // [POST] /signup
    async registerPost(req , res , next){
        const { email, password, name , phone } = req.body
        try{
            const user =  await User.create({ email, password, name , phone })
            // tạo token
            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ user: user._id })
        }
        catch(err){
            const errors = handleErrors(err)
            res.status(400).json( { errors } )
        }
    }
    // [GET] /login
    loginGet(req , res , next){
        res.render('auths/login')
    }
    // [POST] /login
    async loginPost(req , res , next){
        const { email, password } = req.body
        try{
            const user = await User.login(email, password)
            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
            res.status(200).json( { user: user._id })
        }
        catch(err){
            const errors = handleErrors(err)
            res.status(400).json({ errors })
        }
    }
    async logout_get(req, res, next){
        res.cookie('jwt', '', {maxAge: 1 })
        res.redirect('/')   
    }
}

module.exports = new AuthController