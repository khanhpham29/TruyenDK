const path = require('path')
const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const handlebars = require('express-handlebars')



const app = express()
const port = process.env.PORT || 5000

const route = require('./routes')

app.use(express.static(path.join(__dirname, 'public')))
// HTTP logger
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded())
// Template engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources\\views'))

// Route init
route(app)



// app.use(express.urlencoded({ extended: false }))

// app.use(express.json())
// // MySQL
// const connection = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'truyenDK'
// }); 

// Get all truyenDKs
// app.get('', (req , res) => {
    
//     connection.getConnection((err, connection) => {
//         if(err) throw err
//         console.log(`connection as id ${connection.threadId}`)

//         // query(sqlString , callback)
//         connection.query('SELECT * from truyen', (err, rows) => {
//             // connection.release() // return the connection to pool

//             if(!err){
//                 res.send(rows)
//             }else{
//                 console.log(err)
//             }
//         })
//     })



// })



// Listen on enviroment port or 5000
app.listen(port,  () => console.log(`listen on port ${port}`))