const path = require('path')
const express = require('express')
const axios = require('axios')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const db = require('./config/db/server')
const methodOverride = require('method-override')

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express()
const port = process.env.PORT || 3000
// bữa lên mạng xem thằng kia làm @@ nó thiết lập như này à 
const http = require('http')
const server = http.createServer(app)
const socketAPI = require('./socketAPI')
const socketNotify = require('./socketNotify')
socketAPI.io.attach(server)
socketNotify.io.attach(server)
const route = require('./routes/index')
const bodyParser = require('body-parser')

const SortMiddleware = require('./app/middlewares/sortMiddleware')
// Connect to DB    
db.connect();
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// HTTP logger
//app.use(morgan('combined'))

// Customs middlewares
app.use(SortMiddleware)

// Template engine
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'user.hbs',
        helpers: require('./app/helpres/handblebars'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
            },
    })
)
app.set('view engine', '.hbs')
app.set('view options', { layout: 'other' })
app.set('views', path.join(__dirname, 'resources', 'views'))
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Route init
route(app)
// Listen on enviroment port or 5000
server.listen(port,  () => console.log(`listen on port http://localhost:${port}`))