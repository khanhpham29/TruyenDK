const User = require('../models/User')

const findUser = (req, res, next) =>{
    User.findById('60cc89dc05d3a309d4502ff4')
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