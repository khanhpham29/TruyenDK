const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const mangas = new Schema({
	tentruyen:{ type: String, required: true},
	theloai:{ type: String, default: ''},
	mota:{ type: String, default: ''},
	slug:{ type: String, slug: 'tentruyen', unique: true},
	hinh:{ type: String,},
},{
	timestamps : true,
});

module.exports = mongoose.model('mangas', mangas)