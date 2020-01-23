let AWS = require('aws-sdk');
var mysql = require('mysql');
var connection = require('./connectionmanager');
var userModel = require('./user.model');
var s3 = new AWS.S3();

exports.handler = function (event, context, callback) {
	console.log(event);
	
	let operation = '';
	if (typeof event.headers.operation === 'undefined' || typeof event.headers.operation === 'null' ) {
    	operation = 'default';
	}
	else 
		operation = event.headers.operation;

	if(event) {
		switch(operation) {
			case "register":
				userModel.getByEmail(event.bodyjson.email,function(error,results){
			 		if(error){
			            responseFormat(event, context, error);
			 		}
			 		else {
			 			console.log(results);
			 			if(results.data.length > 0) {
			 				responseFormat(event, context, { status: false, message: "Student email already taken",});	
			 			}
			 			else {
			 				let payload = { 
			 								first_name : event.bodyjson.first_name,
			 								last_name : event.bodyjson.last_name,
			 								address : event.bodyjson.address,
			 								picture_url : event.bodyjson.picture_url,
			 								email : event.bodyjson.email,
			 								mobile : event.bodyjson.mobile,
			 								password : event.bodyjson.password,
			 							};
			 				
			 				userModel.createUser(payload, function(error,results){
			 					if(error)
			 						responseFormat(event, context, error);
			 					else 
			 						responseFormat(event, context, { status: true, message: "student created successfully"});
			 				})

			 			}
			 			
			 		}
			 	});
			break;
			case "login":
				userModel.login(event.bodyjson.email,event.bodyjson.password,function(error,results){
					if(error)
 						responseFormat(event, context, error);
 					else {
 						if(results.data.length > 0)
 							responseFormat(event, context, { status: true, message: "Login success", data: results.data});
 						else 
 							responseFormat(event, context, { status: true, message: "Invalid username and password"});
 					}
				});
			break;
			case "update":
				userModel.getById(event.bodyjson.id,function(error,results){
					if(error)
 						responseFormat(event, context, error);
 					else {
 						if(results.data.length > 0) {

 							let payload = { 
			 								first_name : event.bodyjson.first_name,
			 								last_name : event.bodyjson.last_name,
			 								address : event.bodyjson.address,
			 								picture_url : event.bodyjson.picture_url,
			 								mobile : event.bodyjson.mobile,
			 								
			 							};

 							userModel.updateUser(payload, event.bodyjson.id, function(error,results){
			 					if(error)
			 						responseFormat(event, context, error);
			 					else 
			 						responseFormat(event, context, { status: true, message: "student details successfully"});
			 				})
 						}
 						else 
 							responseFormat(event, context, { status: true, message: "Invalid student id"});
 					}
				});
			break;
			case "upload":
				 var rand = Math.floor(Math.random()*90000) + 10000;
				 let encodedImage =event.body.picture_url;
			     let decodedImage = Buffer.from(encodedImage, 'base64');
			     var filePath = "users/image-" + rand  + ".png"
			     var params = {
			       "Body": decodedImage,
			       "Bucket": "test-bucket-tri",
			       "Key": filePath ,
			       "ContentType": "mime/png"
			    };
			    s3.upload(params, function(err, data){
			       if(err) {
			           responseFormat(event, context, err);
			       } else {
			           let response = {
			        "statusCode": 200,
			        "headers": {
			            "my_header": "my_value"
			        },
			        "body": JSON.stringify(data),
			        "isBase64Encoded": false
			    };
			    responseFormat(event, context, response);
			    }
			    });


			break;

			default:
				responseFormat(event, context, { status: false, message: "operation not found in the header"});
			break;
		}
	}
}


function responseFormat(event,context,data) {
	let response = { data , event };
	data.method = event.method;
	data.operation = event.headers.operation;
	// data.headers = event.headers;
	context.done(null, data);
}