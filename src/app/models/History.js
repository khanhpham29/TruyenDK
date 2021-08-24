const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const historyMangaSchema =  new Schema({
    arrMangaId: [{ 
        nameManga: String,
        otherName: String,
        image: String,
        chapter: Number,
        categories: Array,
        slug: String,
        createdAt:{ type: Date, default: Date.now},
        updatedAt:{ type: Date, default: Date.now},
    }] ,
    idUser: { 
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    

},{
    timestamps : true,
},{
    collection: 'histories'
})


module.exports = mongoose.model('histories', historyMangaSchema)