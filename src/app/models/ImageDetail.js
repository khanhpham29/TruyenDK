const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ImgForChapterSchema = new Schema({
	idDetail: {	
		type: Schema.Types.ObjectId,
		ref:'DetailManga'
	},
	imgManga: { 
		type: Object, 
		default: '', 
		unique: true
	},
	chapter:{ 
		type: String, 
	},
	nameManga:{
		type:String
	},
	new:{
		type: String,
		default: "true", 
	},
	slug:{ type: String, slug: 'nameManga'},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
    },{
        collection: 'imgdetails'
    })

module.exports = mongoose.model('ImgDetail', ImgForChapterSchema)