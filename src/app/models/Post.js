const mongoose = require('mongoose');
var mongodbErrors = require('mongoose-mongodb-errors')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { 
        type: String,
        required: "Title is required"
    },
    content: { 
        type: String,
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref:'Comment',
            required: true,
        }
    ],
    imgPost: {type: String} ,
},{
    timestamps: true
})

// Custom query helpers
postSchema.query.sorttable =  function(req){
	if (req.query.hasOwnProperty('_sort')){
		const isValiedtype = ['asc', 'desc'].includes(req.query.type)
		return this.sort({
			[req.query.column]: isValiedtype ? req.query.type : 'desc'
		})
	}
	return this
}



postSchema.plugin(mongodbErrors)
module.exports = mongoose.model('Post', postSchema);