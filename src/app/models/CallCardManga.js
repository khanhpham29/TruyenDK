const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;


const CallCardSchema = new Schema({

	tentruyen:{ type: String, default: ''},

	slug: { type: String, slug: 'tentruyen', unique: true },
},{
	timestamps: true,
},{
	collection: 'callcards'
});

module.exports = mongoose.model('CallCard', CallCardSchema)

