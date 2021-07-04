const User = require('../models/User')

const findUser = (req, res, next) =>{
    User.findById('60dffb159601f20cd0b42722')
    .then((userDB) => {
        req.abc = userDB
        next()
    })
    .catch(err => {
        console.log(err)
        next()
    })
}

module.exports = findUser