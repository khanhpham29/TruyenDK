module.exports = {
    multipleMongoToOject: function(mongoose){
        return mongoose.map(mongoose => mongoose.toOject())
    },
    
    mongooseToOject: function(mongoose){
        return mongoose ? mongoose.toOject():mongoose
    }
}