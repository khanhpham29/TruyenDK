const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema =  new Schema({
    phone: {
        type: String,
        require: true,
    },
    idDetailCart: {
        type: Schema.Types.ObjectId,
        ref:'DetailCart',
        // default: null,
    },
    status:{
        type: String,
        default: 'Chưa xác thực'
    },
    reason: {
        type: String,
        default: ''
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