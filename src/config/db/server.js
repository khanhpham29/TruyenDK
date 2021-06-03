const mysql = require('mysql');


const con = mysql.createConnection({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "truyendk"
});
if(con){
    console.log("Connect successfully!!!")
}else{
    console.log("Connect failure")
}


module.exports = con;