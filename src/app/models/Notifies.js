const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const notifiesSchema =  new Schema({
    idManga:{ 
        type: Schema.Types.ObjectId,
		ref:'mangas'
    },
    idUser:[{ 
        type: Schema.Types.ObjectId,
		ref:'user'
    }],
    idChapter:{ 
        type: Schema.Types.ObjectId,
		ref:'ImgDetail'
    },
},{
    timestamps : true,
},{
    collection: 'notifies'
})



module.exports = mongoose.model('notify', notifiesSchema)