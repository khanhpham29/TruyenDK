const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const rentalForMangaSchema = new Schema({
	idManga: {
        type: Schema.Types.ObjectId,
        ref: 'mangas',
    },
    books: [{
        tentap: {type: 'String', default:''},
        anhbia: {type: 'String', default:''},
        gia: {type: Number, default:0},
        soluong: {type: Number, default:0},
        tacgia: { type:'String', default:''},
        nxb: {type: 'String',default:''},
    }]
    },
    {
        timestamps : true,
    },
    {
        collection: 'rentals',
    })

module.exports = mongoose.model('Rental', rentalForMangaSchema)