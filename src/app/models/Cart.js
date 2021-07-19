const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema =  new Schema({
    phone: {
        type: String,
        require: true,
    },
    idDetailsCart: {
        type: Schema.Types.ObjectId,
        ref: 'DetailsCart'
    },
    status:{
        type: String,
        default: "Chưa xác thực"
    },
    totalPrice: {
        type: Number,
        default: 0
    }
},{
    timestamps : true,
},{
    collection: 'carts'
})


module.exports = mongoose.model('Cart', cartSchema)