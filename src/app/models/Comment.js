const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { 
        type: String 
    },
    idPost: {
        type: Schema.Types.ObjectId,
        ref:"post",
        required:true,
    },
    idComment:{
        type: Schema.Types.ObjectId,
        ref:"comment",
    },
    replies:[
        {
            type: Schema.Types.ObjectId,
            ref:'comment',
        }
    ],
    likes:[
        {
            type: Schema.Types.ObjectId,
            ref:"user",
        }
    ],
    idUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        required: true },
},{
    timestamps: { type: Date, default: Date.now}
}
);

module.exports = mongoose.model('comment', commentSchema);