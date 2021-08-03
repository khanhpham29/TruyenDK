const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');


mongoose.plugin(slug);
const Schema = mongoose.Schema;

const mangaSchema = new Schema({
	nameManga:{ 
		type: String, 
		required: [true, "Vui lòng nhập tên truyện"]
	},
	idDetailManga:{ 
		type:Schema.Types.ObjectId,
		ref:'detail'
	},
	otherName:{
		type: String, 
		default:''
	},
	category:[{ 
		type: Schema.Types.ObjectId,
		ref: 'categorys',
	}],
	image:{ 
		type: String,
		required: [true, "Vui lòng chọn hình"]
	},
	status:{ 
		type: String,
		default: 'Đang tiến hành'
	},
	slug:{ type: String, slug: 'nameManga', unique: true},
},{
	timestamps : true,
},{
	collection: 'mangas'
});

module.exports = mongoose.model('mangas', mangaSchema)