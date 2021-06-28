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
    ]
},{
    timestamps: true
})

postSchema.plugin(mongodbErrors)
module.exports = mongoose.model('Post', postSchema);