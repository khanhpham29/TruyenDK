const User = require('../models/User')

const findUser = (req, res, next) =>{
    User.findById('60ded00a3ac40f16e0c76049')
    .then((userDB) => {
        req.user = userDB
        next()
    })
    .catch(err => {
        console.log(err)
        next()
    })
}

module.exports = findUser