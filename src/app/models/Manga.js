const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const mangas = new Schema({
	tentruyen:{ type: String, required: true},
	theloai:{ type: Array, default: ''},
	mota:{ type: String, default: ''},
	hinh:{ type: String,},
	tinhtrang:{ type: String,default: 'Đang tiến hành'},
	chothue: { type: Boolean, default: false},
	slug:{ type: String, slug: 'tentruyen', unique: true},
},{
	timestamps : true,
},{
	collection: 'mangas'
});

module.exports = mongoose.model('mangas', mangas)