const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const MangaRentalSchema = new Schema({
    nameManga:{ 
        type: String
    },
	slug: {
        type: String, 
        slug: 'nameManga',
    },
    image:{ 
		type: String,
		required: [true, "Vui lòng chọn hình"]
	},
    books: [{
        type: Schema.Types.ObjectId,
		ref: 'book',
		required: true
    }],
    author: { type: String}, 
    publiser: { type: String},
    },
    {
        timestamps : true,
    },
    {
        collection: 'rentals',
    })

module.exports = mongoose.model('Rental', MangaRentalSchema)