const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


mongoose.plugin(slug);
const Schema = mongoose.Schema;

const mangas = new Schema({
	
	tentruyen:{ type: String, required: true},
<<<<<<< HEAD
=======
	tenkhac:{type: String, default:''},
>>>>>>> dat
	theloai:{ type: Array, default: ''},
	mota:{ type: String, default: ''},
	hinh:{ type: String,},
	tinhtrang:{ type: String,default: 'Đang tiến hành'},
<<<<<<< HEAD
	chothue: { type: Boolean, default: false},
=======
	chothue: { type: Boolean, default: false},//Nếu chothue = true => hiển thị thông tin giá, ảnh bìa tập và tên tập
	truyenchothue: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Rental',
		}
	],
>>>>>>> dat
	slug:{ type: String, slug: 'tentruyen', unique: true},
},{
	timestamps : true,
},{
	collection: 'mangas'
});

module.exports = mongoose.model('mangas', mangas)