const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const bookSchema =  new Schema({
    nameManga: { type: String},
    episode: { 
        type: String,
    },
    image: { 
        type: String,
    }, 
    cost: { type: Number},
    rentCost: { type: Number},
    coverCost: { type: Number, default:''},
    amount: { type: Number},
    slug:{ 
        type: String, 
        slug: 'nameManga', 
    },
},{
    timestamps : true,
},{
    collection: 'books'
})



module.exports = mongoose.model('book', bookSchema)