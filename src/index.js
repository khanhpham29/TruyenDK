const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const db = require('./config/db/server')
const methodOverride = require('method-override')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const User = require('./app/models/User')
const app = express()
const port = process.env.PORT || 5000


const route = require('./routes/index')
const bodyParser = require('body-parser')

const SortMiddleware = require('./app/middlewares/sortMiddleware')
const findUser = require('./app/middlewares/findUser')



// Connect to DB    
db.connect();
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// HTTP logger
//app.use(morgan('combined'))

// Customs middlewares
app.use(SortMiddleware)
app.use(findUser)
// Template engine
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        helpers: require('./app/helpres/handblebars'),
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    })
)
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Route init
route(app)



// Listen on enviroment port or 5000
app.listen(port,  () => console.log(`listen on port http://localhost:${port}`))