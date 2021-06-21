const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const rentalForManga = new Schema({
	_id: Schema.Types.ObjectId,
	chapter: [{
        tentap: {type: 'String'},
        anhbia: {type: 'String'},
        gia: {type: number},
        soluong: {type: number},
        tacgia: { type:'String'},
        nxb: {type: 'String', requied},
    }]
    },{
        collection: 'rentalformangas'
    })

module.exports = mongoose.model('RentalForManga', rentalForManga)