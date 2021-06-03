const newsRouter = require('./news.route')
const truyensRouter = require('./truyens.route')

function route(app){

    app.use('/news', newsRouter)
    app.use('/truyens', truyensRouter)
    app.get('/', (req, res) =>{
        res.render('home');
    })
    
    
}

module.exports = route