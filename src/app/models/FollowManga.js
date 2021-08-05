const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const followMangaSchema =  new Schema({
    idManga: [{ 
        type: Schema.Types.ObjectId,
        ref: 'mangas'
    }],
    idUser: { 
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps : true,
},{
    collection: 'follow'
})



module.exports = mongoose.model('follow', followMangaSchema)