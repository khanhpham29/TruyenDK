const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const favouritesSchema =  new Schema({
    idManga:{ 
        type: Schema.Types.ObjectId,
		ref:'mangas'
    },
    arrIdUser:[{ 
        type: Schema.Types.ObjectId,
		ref:'user'
    }],
},{
    timestamps : true,
},{
    collection: 'favourites'
})

module.exports = mongoose.model('favourite', favouritesSchema)