const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema;

const theloai = new Schema({
	tenloai:{ type: String, default: '', required: true},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
	
}
// ,{
// 	timestamps: true,
// }
);

//add  plugin
mongoose.plugin(slug)
theloai.plugin(mongoosedelete, { 
		overrideMethods: true,
		deleteAt: {type:Date, trim: true, default: Date.now},
	})

module.exports = mongoose.model('theloais', theloai)