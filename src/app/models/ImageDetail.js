const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ImgForChapterSchema = new Schema({
	idDetail: {	
		type: Schema.Types.ObjectId,
		ref:'DetailManga'
	},
	imgManga: { type: Object, default: '', unique: true},
	chapter:{ 
		type: String, 
	},
	tentruyen:{type:String},
	slug:{ type: String, slug: 'tentruyen'},
    },{
        collection: 'imgdetails'
    })

module.exports = mongoose.model('ImgDetail', ImgForChapterSchema)