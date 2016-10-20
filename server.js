/*
 * File Name : Server.js
 * Task : Run Server and fetch multiple emails from DB to send reminder
 * Invoke all the email task at once and update DB once the email is sent 
*/

/*
 * Load all the required modules 
*/
var express = require('express');
var  path = require('path');
var fs= require('fs');
var app = express();
var async = require("async");
var http = require("http");
var nodemailer = require("nodemailer");

// This will store emails needed to send.
var listofemails = [];
// Will store email sent successfully.
var success_email = [];
// Will store email whose sending is failed. 
var failure_email = [];

var transporter;


app.use(express.static(path.join(__dirname, 'client')));
//app.use(express.favicon());
app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

/* Loading modules done. */

function massMailer() {
	var self = this;
	transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "inbox.wolfdale@gmail.com",
            pass: "admin@wolfdale"
        }
    });
//    transporter = nodemailer.createTransport({
//        service: 'Gmail',
//        auth: {
//            xoauth2: xoauth2.createXOAuth2Generator({
//                user: 'inbox.wolfdale@gmail.com',
//                clientId: 'inbox.wolfdale@gmail.com',
//                clientSecret: 'admin@wolfdale',
//                refreshToken: 'true',
//                accessToken: 'true'
//            })
//        }
//    });
	// Fetch all the emails from database and push it in listofemails
	self.invokeOperation();
};

/* Invoking email sending operation at once */

massMailer.prototype.invokeOperation = function() {
	var self = this;
	async.each(listofemails,self.SendEmail1,function(){
		console.log(success_email);
		console.log(failure_email);
	});
}

/* 
* This function will be called by multiple instance.
* Each instance will contain one email ID
* After successfull email operation, it will be pushed in failed or success array.
*/

massMailer.prototype.subject='';
massMailer.prototype.content='';
massMailer.prototype.SendEmail1 = function(Email,callback) {
	console.log("Sending email to " + Email);
	var self = this;
	self.status = false;
	// waterfall will go one after another
	// So first email will be sent
	// Callback will jump us to next function
	// in that we will update DB
	// Once done that instance is done.
	// Once every instance is done final callback will be called.
	async.waterfall([
		function(callback) {				
			var mailOptions = {
				from: 'inbox.wolfdale@gmail.com',
				to: Email,
				subject: 'Hi ! This is from Async Script', 
				text: "Hello World !"
			};
			transporter.sendMail(mailOptions, function(error, info) {				
				if(error) {
					console.log(error)
					failure_email.push(Email);
				} else {
					self.status = true;
					success_email.push(Email);
				}
				callback(null,self.status,Email);
			});
		},
		function(statusCode,Email,callback) {
				console.log("Will update DB here for " + Email + "With " + statusCode);
				callback();
		}
		],function(){
			//When everything is done return back to caller.
			callback();
	});
}

massMailer.prototype.SendEmail = function(Email,callback) {
	console.log("Sending email to " + Email);
	var self = this;
	self.status = false;
	// waterfall will go one after another
	// So first email will be sent
	// Callback will jump us to next function
	// in that we will update DB
	// Once done that instance is done.
	// Once every instance is done final callback will be called.
	async.waterfall([
		function(callback) {
			var mailOptions = {
				from: 'inbox.wolfdale@gmail.com',
				to: Email,
				subject: this.subject,
				text: this.content
			};
			transporter.sendMail(mailOptions, function(error, info) {
				if(error) {
					console.log(error)
					failure_email.push(Email);
				} else {
					self.status = true;
					success_email.push(Email);
				}
				callback(null,self.status,Email);
			});
		},
		function(statusCode,Email,callback) {
			console.log("Will update DB here for " + Email + "With " + statusCode);
			callback();
		}
	],function(){
		//When everything is done return back to caller.
		callback();
	});
}


app.post('/loadContact',function(req,res){
	var env=app.get('env')=='development'?'contacts':app.get('env');
	var contactsFile=__dirname+'/server/contacts.json';
	var data=fs.readFileSync(contactsFile,'utf8');
	var contacts=JSON.parse(data).contacts;
	res.send(contacts);
});
app.post('/updateContact',function(req,res){
	fs.writeFile(__dirname+'/server/contacts.json', JSON.stringify({"contacts":req.body}), 'utf-8', function (err) {
		if (err) throw err;
		console.log('filelistAsync complete');
	});
	res.send(req.body);
});
app.post('/loadTemplate',function(req,res){
	var env=app.get('env')=='development'?'templates':app.get('env');
	var templatesFile=__dirname+'/server/templates.json';
	var data=fs.readFileSync(templatesFile,'utf8');
	var templates=JSON.parse(data).templates;
	res.send(templates);
});

app.post('/loadConfig',function(req,res){
	var env=app.get('env')=='development'?'config':app.get('env');
	var configFile=__dirname+'/server/configuration.json';
	var data=fs.readFileSync(configFile,'utf8');
	var configuration=JSON.parse(data).config.data;
	console.log(data);
	res.send(configuration);
});
app.post('/saveConfig',function(req,res){
	fs.writeFile(__dirname+'/server/configuration.json', JSON.stringify({"config":{"data":req.body}}), 'utf-8', function (err) {
		if (err) throw err;
		console.log('filelistAsync complete');
	});
	res.send(req.body);
});

app.post('/login',function(req,res){
	var env=app.get('env')=='development'?'auth':app.get('env');
	var authFile=__dirname+'/server/authentication.json';
	var data=fs.readFileSync(authFile,'utf8');
	var loginData=JSON.parse(data).auth;
	if(loginData.mail==req.body.mail&&loginData.pass==req.body.pass)
		res.send('[{"RESULT":"1"}]');
	else
		res.send('[{"RESULT":"0"}]');
});

app.post('/forgotPassword',function(req,res){
	// Will store email sent successfully.
	success_email = [];
// Will store email whose sending is failed.
	failure_email = [];
	var env=app.get('env')=='development'?'auth':app.get('env');
	var authFile=__dirname+'/server/authentication.json';
	var adata=fs.readFileSync(authFile,'utf8');
	var loginData=JSON.parse(adata).auth;

 	var env=app.get('env')=='development'?'config':app.get('env');
	var configFile=__dirname+'/server/configuration.json';
	var data=fs.readFileSync(configFile,'utf8');
	var configuration=JSON.parse(data).config.data;
	transporter = nodemailer.createTransport({
		service: configuration.service,
		auth: {
			user: configuration.mail,
			pass: configuration.pass
		}
	});
	var mailOptions = {
		from: configuration.mail,
		to: configuration.mail,
		subject: "Password Recovery",
		text: "Your Email Sender User name is '"+loginData.mail+"' and Password is '"+loginData.pass+"'. ",
	};


	//console.log(JSON.stringify(configuration)+":::::"+JSON.stringify(transporter.transporter.options.auth));

	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			console.log(error)
			failure_email.push(configuration.mail);
		} else {
			self.status = true;
			success_email.push(configuration.mail);
		}
	});
	res.send('[{"RESULT":"1"}]');
});
app.post('/sendmail',function(req,res) {
	// Will store email sent successfully.
	success_email = [];
// Will store email whose sending is failed.
	failure_email = [];
	//self.subject=req.body.subject;
	//self.content=req.body.content;
	var env = app.get('env') == 'development' ? 'templates' : app.get('env');
	var templatesFile = __dirname + '/server/templates.json';
	var data = fs.readFileSync(templatesFile, 'utf8');
	var templates = JSON.parse(data).templates;
	var cenv = app.get('env') == 'development' ? 'config' : app.get('env');
	var configFile = __dirname + '/server/configuration.json';
	var cdata = fs.readFileSync(configFile, 'utf8');
	var configuration = JSON.parse(cdata).config.data;

	transporter = nodemailer.createTransport({
		service: configuration.service,
		auth: {
			user: configuration.mail,
			pass: configuration.pass
		}

	});
//async.each(req.body.recipients,this.SendEmail,function(){
//	//	console.log(success_email);
//	res.send('[{"success_email":'+JSON.stringify(success_email)+',"failure_email":'+JSON.stringify(failure_email)+'}]');
//
//	//	console.log(failure_email);
//	});
//	mailSender(function(data){
//		res.end(data);
	//});
	//var mailSender=function(cb){
	req.body.recipients.forEach(function (row) {
		console.log("Sending email to " + row);
		var self = this;
		self.status = false;
		// waterfall will go one after another
		// So first email will be sent
		// Callback will jump us to next function
		// in that we will update DB
		// Once done that instance is done.
		// Once every instance is done final callback will be called.
		async.waterfall([
			function (callback) {
				var mailOptions = {
					from: configuration.mail,
					to: row,
					subject: req.body.subject,
					text: req.body.content,
					html: templates[req.body.template].content.header + req.body.body + templates[req.body.template].content.footer
				};


				//console.log(JSON.stringify(configuration)+":::::"+JSON.stringify(transporter.transporter.options.auth));

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error)
						failure_email.push(row);
					} else {
						self.status = true;
						success_email.push(row);
					}
					callback(null, self.status, row);
				});
			},
			function (statusCode, Email, callback) {
				console.log("Will update DB here for " + Email + "With " + statusCode);
				callback();
			}
		], function () {
			//When everything is done return back to caller.
			console.log(success_email);
			console.log(failure_email);
			if(row==req.body.recipients[req.body.recipients.length-1]){
				res.end('[{"success_email":'+JSON.stringify(success_email)+',"failure_email":'+JSON.stringify(failure_email)+'}]')
			}
		});

	});
//}

});
//app.all('/*',function(req,res){
//    res.sendfile(__dirname+'/public/index.html');
//})
//new massMailer(); //lets begin
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});