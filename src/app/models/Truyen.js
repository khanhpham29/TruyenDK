const db = require('../../config/db/server')

var Truyen = {
    getAllTruyen:(callback)=>{
        return db.query("select * from truyen",callback);
    },
    getTruyenById:(id,callback)=>{
		return db.query("Select * from truyen where id_truyen=?",[id],callback);
	}
	// addTruyen:function(truyen,callback){
	// 	return db.query("Insert into truyen(tentruyen,theloai,hinh,mota) values(?,?,?,?)",[truyen.tentruyen,truyen.theloai,truyen.hinh,truyen.mota],callback);
	// },
	// deleteTruyen:function(id,callback){
	// 	return db.query("delete from truyen where Id=?",[id],callback);
	// },
	// updateTruyen:function(id,truyen,callback){
	// 	return db.query("update truyen set name=?,class=?,dob=? where Id=?",[truyen.name,truyen.class,truyen.dob,id],callback);
	// }
};

module.exports = Truyen;