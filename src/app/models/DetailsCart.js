const mongoose = require('mongoose')
const Schema = mongoose.Schema

const detailsCartSchema =  new Schema({
    _id: Schema.Types.ObjectId,
    idRentalBooks: [{
        type: Schema.Types.ObjectId,
    }],
    status: {
        type: String,
        default: 'Chưa xác thực'
    }

},{
    collection: 'detailscarts'
})


module.exports = mongoose.model('DetailsCart', detailsCartSchema)