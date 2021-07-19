const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const bookSchema =  new Schema({
    tentruyen: { type: String},
    tapso: { type: String},
    anhbia: { type: String}, 
    giagoc: { type: Number},
    giathue: { type: Number},
    giabia: { type: Number, default:''},
    soluong: { type: Number},
    tacgia: { type: String}, 
    nxb: { type: String},
},{
    timestamps : true,
},{
    collection: 'books'
})


module.exports = mongoose.model('book', bookSchema)