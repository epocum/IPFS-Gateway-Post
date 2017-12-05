var fs = require('fs'), 
httpProxy = require('http-proxy');

// ----- ByPass ----- //

var proxy = httpProxy.createServer({
	  target: {
	    host: '79.61.132.152',
	    port: 8545
	  },
	  ssl: {
	    key: fs.readFileSync('./SSL/privkey.pem', 'utf8'),
	    cert: fs.readFileSync('./SSL/cert.pem', 'utf8')
	  }
})
console.log('Proxy up on port 443 // Permit bridge over HTTPS --> HTTP !');

proxy.listen(443);


