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
    idManga:{ 
		type:Schema.Types.ObjectId,
		ref:'mangas'
	},
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref:'comment',
            required: true,
        }
    ],
    imgPost: {
        type: String
    },
},{
    timestamps: true
})


postSchema.plugin(mongodbErrors)
module.exports = mongoose.model('post', postSchema);