const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;


const MangaDetailsSchema = new Schema({
	nameManga:{ 
		type:String,
	},
	imgDetails: [{
		type: Schema.Types.ObjectId, 
		ref: 'ImgDetail'
	}],
	description:{ 
		type: String, 
		default: '',
	},
	slug:{ type: String, slug: 'nameManga', unique: true},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
},{
	collection: 'details'
});

module.exports = mongoose.model('detail', MangaDetailsSchema)

