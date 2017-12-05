var express = require('express');
var https = require('https');
var ejs = require('ejs');
var fs = require('fs');

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

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'token') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
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

var port = process.env.PORT || 8888;
var server = https.createServer( options, app );

var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	//console.log(clientIp.slice(7));

    socket.on('epocum', function (website) {
        // The username of the person who clicked is retrieved from the session variables
	
        console.log(website + ' is actual visited thanks to an adviser: ' + clientIp.slice(7) + 'owner of ipfs URL:');
    }); 

});

app.use(express.static('.' + '/'));
//https.createServer(options,app).listen(443);

server.listen( port, function () {
    console.log( 'Broadcast up on port ' + server.address().port );
} );

