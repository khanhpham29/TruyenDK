const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


mongoose.plugin(slug);
const Schema = mongoose.Schema;

const mangas = new Schema({
	tentruyen:{ type: String, required: true},
	theloai:{ type: Array, default: ''},
	mota:{ type: String, default: ''},
	hinh:{ type: String,},
	tinhtrang:{ type: String,default: 'Đang tiến hành'},
	chothue: { type: Boolean, default: false},//Nếu chothue = true => hiển thị thông tin giá, ảnh bìa tập và tên tập
	tentap: [{type: Schema.Types.ObjectId, ref: 'RentalForManga'}],
	slug:{ type: String, slug: 'tentruyen', unique: true},
},{
	timestamps : true,
},{
	collection: 'mangas'
});

module.exports = mongoose.model('mangas', mangas)