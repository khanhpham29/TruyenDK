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
	posted:{
		type: Boolean,
		default:false,
	},
	otherName:{
		type: String, 
		default:''
	},
	categories:[{ 
		type: Schema.Types.ObjectId,
		ref: 'categories',
	}],
	image:{ 
		type: String,
		required: [true, "Vui lòng chọn hình"]
	},
	slug:{ type: String, slug: 'nameManga', unique: true},
},{
	timestamps : true,
},{
	collection: 'mangas'
});

module.exports = mongoose.model('mangas', mangaSchema)