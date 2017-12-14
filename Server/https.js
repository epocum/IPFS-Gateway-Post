var express = require('express');
var https = require('https');
var ejs = require('ejs');
var fs = require('fs');
var request = require('request');
var trycatch = require('trycatch')

var Web3 = require('web3');
var web3 = new Web3();
web3 = new Web3(new Web3.providers.HttpProvider("http://79.61.132.152:8545"));

// Create a new Express application.
var app = express();

var options = {
  key: fs.readFileSync('./SSL/privkey.pem'),
  cert: fs.readFileSync('./SSL/cert.pem'),
  ca: fs.readFileSync('./SSL/chain.pem')
};


app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true,
                            cookie: { maxAge : 200000000 }
					 }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.all('/', function(request, response) {

	request.session.user_id;

	var content = fs.readFileSync('.' +'/index.html', 'utf-8');
	var compiled = ejs.compile(content);

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(compiled({
    	//id: id,
    	//name: name,
	//codice: ''

    }));


	});

app.all('/filter/:filter', function(req, resp) {

		var filter =  req.params.filter;
		var ipAdd = req.connection.remoteAddress.replace('::ffff:','');
		
		console.log(filter);
		
		trycatch(function() {
				        
		        var Web3options = {
					  uri: 'http://79.61.132.152:8545',
					  method: 'POST',
					  headers: {
					          "content-type": "application/json",
					  },
					  json: {
					    "jsonrpc":"2.0",
					    "method":"shh_getFilterMessages",
					    "params":[filter],
					    "id":1
					  }
					};
		
				
		        request(Web3options, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    var message = body.result[0].payload;
				    console.log('Get Conn from: ' + ipAdd + '  ' + web3.toAscii(message));
				      }
				});

		  // do something error-prone 
		}, function(err) {
		  console.log('Web3 - No filter passed');
		})


	});


var port = process.env.PORT || 8888;
var server = https.createServer( options, app );

app.use(express.static('.' + '/'));
//https.createServer(options,app).listen(443);

server.listen( port, function () {
    console.log( 'Broadcast up on port ' + server.address().port );
} );
