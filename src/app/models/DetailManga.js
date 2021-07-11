const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;


const MangaDetailsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	tentruyen:{ type: String, default: ''},
	ImgDetail: [{type: Schema.Types.ObjectId, ref: 'ImgDetail'}],
	//imgManga: { type: Object, default: '', unique: true},
	slug: { type: String, slug: 'tentruyen', unique: true },
},{
	timestamps: true,
},{
	collection: 'details'
});

module.exports = mongoose.model('Detail', MangaDetailsSchema)

