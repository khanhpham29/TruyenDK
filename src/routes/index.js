const newsRouter = require('./news.route')
const truyensRouter = require('./truyens.route')
const adminRouter = require('./admin.route')
function route(app){

    app.use('/truyens', truyensRouter)
    app.use('/news', newsRouter)
    app.use('/admin', adminRouter)
    app.get('/', (req, res) =>{
        res.render('home');
    })
    
    
}

module.exports = route