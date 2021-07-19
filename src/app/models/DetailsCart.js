const mongoose = require('mongoose')
const Schema = mongoose.Schema

const detailsCartSchema =  new Schema({

    idCart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    listRentalBooks: [{
        tentruyen: {type: String},
        tapso: {type: String},
        amount: {type: Number},
        giathue: {type: Number}
    }],
    songaythue: {
        type: Number,
    },
    createAt:{ type: Date, default: Date.now},

},{
    collection: 'detailscarts'
})


module.exports = mongoose.model('DetailsCart', detailsCartSchema)