const newsRouter = require('./news.route')
const truyensRouter = require('./truyens.route')
function route(app){

    app.use('/truyens', truyensRouter)
    app.use('/news', newsRouter)
    
    app.get('/', (req, res) =>{
        res.render('home');
    })
    
    
}

module.exports = route