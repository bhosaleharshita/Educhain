
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
var bodyParser = require('body-parser');

// Import all function modules
const register= require('./register');
const enrollUser = require('./enrollUser');
const login = require('./login');
const logout = require('./logout');
const queryapp = require('./queryapp');
const update=require('./update');
const queryallapp = require('./queryallapp');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.set('title', 'Educhain App');


app.set('views', __dirname + '/template/demo');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/template')); 
app.use(express.static(__dirname + '/template/demo')); 

//session needs
const session = require('express-session');
//app.use(session({secret: "Shh, its a secret!"}));

app.use(session({
    resave: false, 
    saveUninitialized: true,
    secret: 'Educhain app', 
    cookie: {maxAge: 60 * 1000 * 30}
}));
var sess;

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  console.log('In local user');
  console.log(res.locals.user);
  next();
});


app.get('/main', function (req, res) {  
   res.sendFile( __dirname + "/template/demo/" + "main.html" );  
});

app.post('/login', (req, res) => {
  	login.execute(req.body.username)
			.then(() => {
				console.log('Logged in successfully');
				sess=req.session;
				sess.user_name= req.body.username;
				//res.locals.user=req.body.username;

				console.log(req.session.user_name);

				const result = {
					status: 'success',
					message: 'Logged in successfully',
					username: sess.user_name
				};
				//res.json(result);
				//console.log(typeof req.session);
				res.render( __dirname + "/template/demo/" + "home_main.html", {result:result});	
				//res.render( __dirname + "/template/demo/" + "queryform.html", {result:result});	
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Login failed. Enter valid credentials',
					error: e
				};
				console.log(e);
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "login.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});

app.post('/register', (req, res) => {
  register.execute(req.body.prn, req.body.clg, req.body.examno)
			.then(() => {
				console.log('Registered for the exam successfully');
				const result = {
					status: 'success',
					message: 'Registered for the exam successfully!',
					username: req.body.prn
				};
				//res.json(result);
				console.log('In Registration');
				console.log(sess.user_name);
				res.render( __dirname + "/template/demo/" + "home_main.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Exam Registration failed: Check Form again!',
					error: e,
					username:req.body.prn
					//username: sess.user_name
				};
				//res.status(500).send(result);
				console.log(e);
				res.render( __dirname + "/template/demo/" + "registerform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});



app.post('/update', (req, res) => {
  update.execute(req.body.prn, req.body.pprno, req.body.uniname,req.body.updatereq)
			.then(() => {
				console.log('Updation request  successfull');
				const result = {
					status: 'success',
					message: 'Updation request  successfull!',
					username: req.body.prn
				};
				//res.json(result);
				res.render( __dirname + "/template/demo/" + "updateform.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Updation Request failed: Check Form again!',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "updateform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});





app.post('/queryapp', (req, res) => {
  queryapp.execute(req.body.prn, req.body.certiNo)
			.then((json1) => {
				console.log('Certificates viewed successfully');

				console.log(json1);
				
				/*
				json_org=json1[0].Value.currentState;	
				json_str=JSON.stringify(json1);			
				
				var str= [];
				for(var i = 0; i < Object.keys(json1).length; i++) {
            		
            		var temp=[];
        			temp.push(json1[i].Value.student_id);
        			temp.push(json1[i].Value.currentState);
        			temp.push(json1[i].Value.registration_DateTime);
        			temp.push(json1[i].Value.certNumber);
        			temp.push(json1[i].Value.collegename);
        			temp.push(json1[i].Value.marks);
        			temp.push(json1[i].Value.examno);
        			temp.push(json1[i].Timestamp);

        			console.log(temp);

        			str.push(temp);
            		           		
        		}
		
				*/
				var str2= [];
				for(var i = 0; i < Object.keys(json1).length; i++) {
            		
            		var temp=[];
        			temp.push(json1[i].Record.student_id);

        			if(json1[i].Record.currentState==1){
        				temp.push('REGISTERED');
        			}
        			else if(json1[i].Record.currentState==2){
        				temp.push('PENDING');
        			}
        			else if(json1[i].Record.currentState==3){
        				temp.push('APPROVED');
        			}
        			else if(json1[i].Record.currentState==4){
        				temp.push('GRANTED');
        			}

        			temp.push(json1[i].Record.registration_DateTime);
        			temp.push(json1[i].Record.certNumber);
        			temp.push(json1[i].Record.collegename);
        			temp.push(json1[i].Record.marks);
        			temp.push(json1[i].Record.examno);
        			temp.push(json1[i].Key);

        			console.log(temp);

        			str2.push(temp);
            		           		
        		}

        		console.log(str2);
        		
				
				const result = {
					status: 'success',
					message: 'Viewed transactions successfully!',
					j1: str2,
					//j2: str2,
					//count1: str.length,
					count2: str2.length,
					username: req.body.prn
				};

				console.log('In View transaction');
				console.log(sess.user_name);

				//res.json(result);
				res.render( __dirname + "/template/demo/" + "home.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'View transactions failed: Check Certificate again!',
					error: e,
					username: sess.user_name
				};
				//res.status(500).send(result);
				console.log(e);
				res.render( __dirname + "/template/demo/" + "queryform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});


app.post('/queryallapp', (req, res) => {
  queryallapp.execute(req.body.prn, req.body.certiNo)
			.then((json1) => {
				console.log('Certificates viewed successfully');

									
				var str= [];
				for(var i = 0; i < Object.keys(json1).length; i++) {
            		
            		var temp=[];
        			temp.push(json1[i].Value.student_id);
        			temp.push(json1[i].Value.currentState);
        			temp.push(json1[i].Value.registration_DateTime);
        			temp.push(json1[i].Value.certNumber);
        			temp.push(json1[i].Value.collegename);
        			temp.push(json1[i].Value.marks);
        			temp.push(json1[i].Value.examno);
        			temp.push(json1[i].Timestamp);

        			console.log(temp);

        			str.push(temp);
            		           		
        		}

				
				const result = {
					status: 'success',
					message: 'Viewed transactions successfully!',
					j1: str,
					//j2: str2,
					count1: str.length,
					//count2: str2.length,
					username: req.body.prn
				};

				console.log('In View transaction');
				console.log(sess.user_name);

				//res.json(result);
				res.render( __dirname + "/template/demo/" + "home2.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'View transactions failed: Check Certificate again!',
					error: e,
					username: sess.user_name
				};
				//res.status(500).send(result);
				console.log(e);
				res.render( __dirname + "/template/demo/" + "queryallform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});



app.post('/logout', (req, res) => {
  	logout.execute(sess.user_name)
			.then(() => {
				console.log('Logged out successfully');
				req.session.destroy();
				
				//console.log(req.session.user_name);

				const result = {
					status: 'success',
					message: 'Logged out successfully'
				};
				//res.json(result);
				//console.log(typeof req.session);
				res.render( __dirname + "/template/demo/" + "main.html", {result:result});	
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Logout failed. Please try again!',
					error: e
				};
				console.log(e);
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "main.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});



app.post('/enrollUser', (req, res) => {
	enrollUser.execute(req.body.uname)
			.then(() => {
				console.log('User credentials added to wallet');
				const result = {
					status: 'success',
					message: 'User credentials added to wallet',
					uname: req.body.uname
				};
				res.render( __dirname + "/template/demo/" + "UserForm.html", {result:result});	
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					//error: e
				};
				res.status(500).send(result);
				//res.render(__dirname + "index.html", {uname:uname});

			});
});

app.listen(port, () => console.log(`Distributed Certification App listening on port ${port}!`));

