const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema



const TheloaiSchema = new Schema({
	tenloai:{ type: String, default: '', required: true},
},{
	timestamps: true,
});
mongoose.plugin(slug)
TheloaiSchema.plugin(mongooseDelete, { 
	deleteAt:true,
	overrideMethods: true 
})

module.exports = mongoose.model('theloais', TheloaiSchema)