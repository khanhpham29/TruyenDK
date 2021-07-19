const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const rentalForMangaSchema = new Schema({
	slug: {
        type: String,
    },
    books: [{
        tentruyen: {type: 'String', default:''},
        tapso: {type: 'String', default:''},
        anhbia: {type: 'String', default:''},
        giagoc: {type: Number, default:0},
        giathue: {type: Number, default:0},
        giabia: {type: Number, default:0},
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