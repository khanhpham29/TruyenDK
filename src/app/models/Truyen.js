const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TruyenSchema = new Schema({
	tentruyen:{ type: String, default: ''},
	tenloai:{ type: String, default: ''},
	theloai:{ type: String, default: ''},
	mota:{ type: String, default: ''},
	hinh:{ type: String, default: ''},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
});

module.exports = mongoose.model('Truyen', TruyenSchema)