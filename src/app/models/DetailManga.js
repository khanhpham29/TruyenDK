const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;


const MangaDetailsSchema = new Schema({
	idManga:{ 
		type:Schema.Types.ObjectId,
		ref:'mangas'
	},
	nameManga:{ 
		type:String,
	},
	arrIdFollow:[{ 
		type:Schema.Types.ObjectId,
		ref:'follow'
	}],
	idFavourite:{ 
		type:Schema.Types.ObjectId,
		ref:'favourite'
	},
	idPost:{ 
		type:Schema.Types.ObjectId,
		ref:'post'
	},
	imgDetails: [{
		type: Schema.Types.ObjectId, 
		ref: 'ImgDetail'
	}],
	description:{ 
		type: String, 
		default: '',
	},
	status:{ 
		type: String,
		default: 'Đang tiến hành'
	},
	slug:{ type: String, slug: 'nameManga'},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
},{
	collection: 'detailMangas'
});

module.exports = mongoose.model('detail', MangaDetailsSchema)

