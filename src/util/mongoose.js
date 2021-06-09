module.exports = {
    mutipleMongooseToOject: function(mongooses){
        return mongooses.map(mongooses => mongooses.toObject({ getters: true }))
    },
    mongooseToOject: function(mongoose){
        return mongoose ? mongoose.toObject({ getters: true }) : mongoose
    }
}