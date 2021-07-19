const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema =  new Schema({
    phone: {
        type: String,
        require: true,
    },
    idDetailCart: [{
        type: Schema.Types.ObjectId,
        ref:'DetailCart',
        required: true,
    }],
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