const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete')

const slug = require('mongoose-slug-generator')

const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	_id :{ type: Number},
	tenloai:{   type: String, 
				default: '',
				unique: true,
				required: true
	},
	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
	
},{
	_id: false,
}
);

// Custom query helpers
categorySchema.query.sorttable =  function(req){
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

categorySchema.plugin(AutoIncrement)
categorySchema.plugin(mongoosedelete, { 
		overrideMethods: true,
		deleteAt: {type:Date, trim: true, default: Date.now()},
	})

module.exports = mongoose.model('categorys', categorySchema)