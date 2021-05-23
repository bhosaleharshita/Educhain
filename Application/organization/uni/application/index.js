
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
var bodyParser = require('body-parser');

// Import all function modules
const login = require('./login');
const enrollUser = require('./enrollUser');
const approve = require('./approve');
const grant = require('./grant');

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


app.post('/approve', (req, res) => {
  approve.execute(req.body.prn, req.body.certiNo, req.body.clg, req.body.marks)
			.then(() => {
				console.log('Approved successfully');
				const result = {
					status: 'success',
					message: 'Approved certificate successfully!',
					username: req.body.prn
				};
				//res.json(result);
				res.render( __dirname + "/template/demo/" + "approveform.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Approve failed: Check Certificate again!',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "approveform.html", {result:result});
				//res.sendFile( __dirname + "/template/demo/" + "index.html" );  
			});
});

app.post('/grant', (req, res) => {
  grant.execute(req.body.prn, req.body.certiNo, req.body.clg, req.body.marks)
			.then(() => {
				console.log('Certificate granted successfully');
				const result = {
					status: 'success',
					message: 'Certificate granted successfully!',
					username: req.body.prn
				};
				//res.json(result);
				res.render( __dirname + "/template/demo/" + "grantform.html", {result:result});
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Grant failed: Check Certificate again!',
					error: e
				};
				//res.status(500).send(result);
				res.render( __dirname + "/template/demo/" + "grantform.html", {result:result});
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
				if(req.body.username=="sppu"){
				res.render( __dirname + "/template/demo/" + "home.html", {result:result});
				}	
				else{
				res.render( __dirname + "/template/demo/" + "home_institute.html", {result:result});
				}
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
				res.json(result);
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

