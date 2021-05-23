
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
var bodyParser = require('body-parser');

// Import all function modules
const register= require('./register');
const enrollUser = require('./enrollUser');
const login = require('./login');
const queryapp = require('./queryapp');

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

const session = require('express-session');


app.get('/main', function (req, res) {  
   res.sendFile( __dirname + "/template/demo/" + "main.html" );  
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
				res.render( __dirname + "/template/demo/" + "registerform.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Registration failed: Check Form again!',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "registerform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});


app.post('/queryapp', (req, res) => {
  queryapp.execute(req.body.prn, req.body.certiNo)
			.then((json1) => {
				console.log('Certificates viewed successfully');
				
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

        		console.log(str);
				console.log(json_str);
				
				const result = {
					status: 'success',
					message: 'queryapp successfully!',
					j1: str,
					j2: json_str
				};

				//res.json(result);
				res.render( __dirname + "/template/demo/" + "home.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Grant failed: Check Certificate again!',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "queryform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});



app.post('/login', (req, res) => {
	sess = req.session;
  	login.execute(req.body.username)
			.then(() => {
				console.log('Logged in successfully');
				const result = {
					status: 'success',
					message: 'Logged in successfully',
					username: req.body.username
				};
				//res.json(result);
				res.render( __dirname + "/template/demo/" + "home_main.html", {result:result});	
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Login failed. Enter valid credentials',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "login.html", {result:result});
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

