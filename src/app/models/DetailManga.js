const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const MangaDetailsSchema = new Schema({
	tentruyen:{ type: String, default: ''},
	chapter: { type: String, default: ''},
	tenfile: { type: String, default: ''},
	loaifile: { type: String, default: '' },
	imgBase64: { type: String, default: '', unique: true},
	slug: { type: String, slug: 'chapter', unique: true },
},{
	timestamps: true,
});

module.exports = mongoose.model('Detail', MangaDetailsSchema)