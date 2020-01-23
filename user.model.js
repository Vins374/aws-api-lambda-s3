let AWS = require('aws-sdk');
var mysql = require('mysql');
var connection = require('./connectionmanager');


module.exports.createUser = function(data, callback) {
	connection.query("INSERT INTO student (email, password, last_name, first_name, address, picture_url, mobile) VALUES (?, ?, ?, ?, ?, ?, ?);", [data.email,data.password,data.last_name,data.first_name,data.address,data.picture_url,data.mobile], (error,result,fields) => {
		if(error){
			callback(error,{ status: false, message: "error occured while fetching" });
		}
		callback(null,{ status:true, message:"data found", data: result });
	});
}

module.exports.getByEmail = async function(email, callback) {
	connection.query("SELECT * FROM student where email = ?", [email], (error,result,fields) => {
		if(error){
			callback(error,{ status: false, message: "error occured while fetching" });
		}
		callback(null,{ status:true, message:"data found", data: result });
	});
}

module.exports.login = async function(email, password, callback) {
	connection.query("SELECT * FROM student where email = ? and password = ?", [email, password], (error,result,fields) => {
		if(error){
			callback(error,{ status: false, message: "error occured while fetching" });
		}
		callback(null,{ status:true, message:"data found", data: result });
	});
}

module.exports.getById = async function(id, callback) {
	connection.query("SELECT * FROM student where id = ?", [id], (error,result,fields) => {
		if(error){
			callback(error,{ status: false, message: "error occured while fetching" });
		}
		callback(null,{ status:true, message:"data found", data: result });
	});
}

module.exports.updateUser = async function(data, id, callback) {
	connection.query("update student set last_name = ?, first_name = ?, address = ?, picture_url = ?, mobile = ? where id = ?;", [data.last_name, data.first_name, data.address, data.picture_url, data.mobile ,id], (error,result,fields) => {
		if(error){
			callback(error,{ status: false, message: "error occured while fetching" });
		}
		callback(null,{ status:true, message:"data found", data: result });
	});
}