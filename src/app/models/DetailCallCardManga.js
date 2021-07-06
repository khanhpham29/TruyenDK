const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;


const DetailsCallCardSchema = new Schema({

    idRental: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Rental',
		}
	],
    idBooks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Rental.books',
		}
	],
	status: { type: 'String', default: 'Đã xử lý'},// Chưa xử lý -> Đã xử lý -> Hoàn thành
},{
	timestamps: true,
},{
	collection: 'callcards'
});

module.exports = mongoose.model('CallCard', DetailsCallCardSchema)

