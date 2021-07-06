const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete')

const slug = require('mongoose-slug-generator')

const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;

const theloaiSchema = new Schema({
	_id :{ type: Number},
	tenloai:{ type: String, default: '', required: true},

	createAt:{ type: Date, default: Date.now},
	updateAt:{ type: Date, default: Date.now},
	
},{
	_id: false,
	collection: 'categories'
}
);

// Custom query helpers
theloaiSchema.query.sorttable =  function(req){
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

theloaiSchema.plugin(AutoIncrement)
theloaiSchema.plugin(mongoosedelete, { 
		overrideMethods: true,
<<<<<<< HEAD
		deleteAt: {type:Date, trim: true, default: Date.now()},
=======
		deleteAt: {type:Date, trim: true, default: Date.now},
>>>>>>> dat
	})

module.exports = mongoose.model('theloais', theloaiSchema)