const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
	nameCategory:{   
		type: String, 
		required: [true, 'Vui lòng nhập tên thể loại'],
		unique: true,
	},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
},{
	collection: 'categories'
}
);
// Custom query helpers
categoriesSchema.query.sorttable =  function(req){
	if (req.query.hasOwnProperty('_sort')){
		const isValiedtype = ['asc', 'desc'].includes(req.query.type)
		return this.sort({
			[req.query.column]: isValiedtype ? req.query.type : 'desc'
		})
	}
	return this
}
//add  plugin
mongoose.plugin(slug)

categoriesSchema.plugin(mongoosedelete, { 
		overrideMethods: true,
		deleteAt: {type:Date, trim: true, default: Date.now()},
	})
module.exports = mongoose.model('categories', categoriesSchema)
