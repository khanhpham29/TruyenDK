const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { 
        type: String 
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
},{
    timestamps: { type: Date, default: Date.now}
}
);

module.exports = mongoose.model('Comment', commentSchema);