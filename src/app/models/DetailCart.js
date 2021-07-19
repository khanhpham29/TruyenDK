const mongoose = require('mongoose')
const Schema = mongoose.Schema

const detailsCartSchema =  new Schema({

    idCart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    listRentalBooks: {
        items:[{
            bookId:{
                type: Schema.Types.ObjectId,
                ref: 'book',
                required: true,
            },
            amount:{ 
                type: Number,
                required: true,
            }
        }],
        
    },
    totalItem:{
        type:Number,
    },
    totalPrice:{ 
        type: Number
    },
    songaythue: {
        type: Number,
    },

    createAt:{ type: Date, default: Date.now},

},{
    collection: 'detailcart'
})


module.exports = mongoose.model('DetailCart', detailsCartSchema)