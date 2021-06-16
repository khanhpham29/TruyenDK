const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const theloai = new Schema({
	tenloai:{ type: String, default: '', required: true},
	createAt:{ type: Date, default: Date.now()},
	updateAt:{ type: Date, default: Date.now()},
},{
	collection: 'categories'
});

module.exports = mongoose.model('theloai', theloai)