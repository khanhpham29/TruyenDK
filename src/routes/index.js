const newsRouter = require('./news')


function route(app){

    app.use('/news', newsRouter)

    app.get('/', (req, res) =>{
        res.render('home');
    })
    
    // app.get('/news', (req, res) =>{
    //     res.render('news');
    // })
    
}

module.exports = route