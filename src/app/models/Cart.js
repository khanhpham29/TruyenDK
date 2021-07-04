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