
const User_Model = require('../../models/User')
const Cart_Model = require('../../models/Cart')
const DetailsCart_Model = require('../../models/DetailCart')
const multer = require('multer')

const { multipleMongooseToOject } = require('../../../util/mongoose')
const { mongooseToOject } = require('../../../util/mongoose')
const mongoose = require('mongoose')



class MemberController{
    //--------------USER--------------------//
    async listUsers(req, res, next){
        await User_Model.find({role: "member"})
        .then((users) => {
            console.log(users)
            res.render('admins/users/list-users', {
                users: multipleMongooseToOject(users),
                layout:'admin'
            })
        })
        .catch(next)
    }


    async searchUsers(req, res, next){
        const users = await User_Model.find({})
        .then((users) => {
            res.json({users: multipleMongooseToOject(users)})
        })
        .catch(next)
    }

    blockAccount(req, res, next){
        console.log(req.params.id)
        console.log(req.body)
        if(req.body.status == 'active'){
            User_Model.updateOne({_id: req.params.id}, {
                status: 'block',
                reason: req.body.reason
            })
            .then(() => {
                res.json({message: 'khóa tài khoản thành công'})
            })
            .catch(next)
        }
        else if(req.body.status == 'block'){
            User_Model.updateOne({_id: req.params.id}, {
                status: 'active'
            })
            .then(() => {
                res.json({message: 'mở khóa tài khoản thành công'})
            })
            .catch(next)
        }
    }

}
module.exports = new MemberController