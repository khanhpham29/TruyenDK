const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ImgForChapterSchema = new Schema({
	_id: Schema.Types.ObjectId,
	imgManga: { type: Object, default: '', unique: true},
	chapter:{ 
		type: String, 
	}
    },{
        collection: 'imgdetails'
    })

module.exports = mongoose.model('ImgDetail', ImgForChapterSchema)