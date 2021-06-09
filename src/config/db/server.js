const mongoose = require('mongoose');


async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/mangadk', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect successfully!!!')
    }catch(error){
        console.log('connect failure')
    }
    
}



module.exports = { connect };