var fs = require('fs'), 
httpProxy = require('http-proxy');

// ----- ByPass ----- //

var proxy = httpProxy.createServer({
	  target: {
	    host: 'xxx.xxx.xxx.xxx',
	    port: 8545
	  },
	  ssl: {
	    key: fs.readFileSync('./SSL/privkey.pem', 'utf8'),
	    cert: fs.readFileSync('./SSL/cert.pem', 'utf8')
	  }
})
console.log('Proxy up on port 443 // Permit bridge over HTTPS --> HTTP !');

proxy.listen(443);


